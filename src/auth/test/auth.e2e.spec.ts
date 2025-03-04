import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../entities/user.entity';

import { v4 as uuidv4 } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth.module';
import { RolesModule } from '../roles/roles.module';
import { Permission } from '../permissions/entities/permission.entity';
import { EnvConfiguration } from '../../config/app.config';
import { JoiValidationSchema } from '../../config/joi.validation';
import { Lead } from '../../sales/leads/entities/lead.entity';
import { SaleCommunication } from '../../sales/sale-communication/entities/sale-communication.entity';
// Set longer timeout for all tests
jest.setTimeout(120000); // 2 minutes

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminJwtToken: string;
  let regularUserJwtToken: string;
  let testUserId: string;
  let adminRoleId: string;
  let regularRoleId: string;

  // Test user data with random emails to avoid conflicts
  const adminUser = {
    name: 'Admin User',
    email: `admin-${Date.now()}@example.com`,
    password: 'Admin123!',
  };

  const regularUser = {
    name: 'Regular User',
    email: `user-${Date.now()}@example.com`,
    password: 'User123!',
  };

  beforeAll(async () => {
    try {
      console.log('Starting test setup with focused modules...');

      // Create a more focused test module with only what we need
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/src/config/env/${
              process.env.NODE_ENV || 'development'
            }.env`,
            isGlobal: true,
            load: [EnvConfiguration],
            validationSchema: JoiValidationSchema,
          }),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
              config: ConfigService,
            ): Promise<TypeOrmModuleOptions> => {
              const isProduction =
                config.get<string>('NODE_ENV') === 'production';

              console.log('Database connection details:');
              console.log(`Host: ${config.get('POSTGRES_DB_HOST')}`);
              console.log(`Port: ${config.get('POSTGRES_DB_PORT')}`);
              console.log(`Username: ${config.get('POSTGRES_DB_USERNAME')}`);
              console.log(`Database: ${config.get('POSTGRES_DB_NAME')}`);

              const baseConfig = {
                type: 'postgres',
                host: config.get<string>('POSTGRES_DB_HOST'),
                port: config.get<number>('POSTGRES_DB_PORT'),
                password: config.get<string>('POSTGRES_PASSWORD'),
                username: config.get<string>('POSTGRES_DB_USERNAME'),
                database: config.get<string>('POSTGRES_DB_NAME'),
                // Remove the explicit entities array
                // entities: [User, Role, Permission, Lead],
                autoLoadEntities: true, // Use this instead
                synchronize: false,
                logging: ['error'], // Reduce logging to only errors
                ssl: isProduction ? {} : false,
              };

              return baseConfig as TypeOrmModuleOptions;
            },
          }),
          AuthModule,
          RolesModule,
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ transform: true }));

      console.log('Initializing app...');
      await app.init();
      console.log('App initialized.');

      // Get DataSource from the app
      dataSource = app.get(DataSource);
      console.log(
        'DataSource obtained:',
        dataSource.isInitialized ? 'initialized' : 'not initialized',
      );

      if (!dataSource.isInitialized) {
        throw new Error('DataSource is not initialized');
      }

      // Start with direct database operations to set up roles
      console.log('Setting up roles...');
      const roleRepository = dataSource.getRepository(Role);
      const permissionRepository = dataSource.getRepository(Permission);

      // Create roles directly with minimum permissions needed for tests
      const timestamp = Date.now();
      const adminPermission = await permissionRepository.save({
        name: `admin_permissions_${timestamp}`,
        canCreateUser: true,
        canDeleteUser: true,
        canUpdateUser: true,
        canViewUser: true,
      });

      const adminRole = await roleRepository.save({
        name: `admin_test_${timestamp}`,
        permission: adminPermission,
      });
      adminRoleId = adminRole.id;
      console.log(`Admin role created with ID: ${adminRoleId}`);

      const userPermission = await permissionRepository.save({
        name: `user_permissions_${timestamp}`,
        canCreateUser: false,
        canDeleteUser: false,
        canUpdateUser: false,
        canViewUser: true,
      });

      const regularRole = await roleRepository.save({
        name: `user_test_${timestamp}`,
        permission: userPermission,
      });
      regularRoleId = regularRole.id;
      console.log(`Regular role created with ID: ${regularRoleId}`);

      // Now register users using the API
      console.log('Registering test users...');
      console.log('Admin registration payload:', {
        ...adminUser,
        role: adminRoleId,
      });

      const adminRegisterResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...adminUser,
          role: adminRoleId,
        });

      console.log(
        'Admin registration response status:',
        adminRegisterResponse.status,
      );
      console.log(
        'Admin registration response body:',
        adminRegisterResponse.body,
      );

      if (adminRegisterResponse.status !== 201) {
        console.error('Admin registration failed:', adminRegisterResponse.body);
        throw new Error('Admin registration failed');
      }

      adminJwtToken = adminRegisterResponse.body.token;
      console.log('Admin user registered.');

      console.log('Regular user registration payload:', {
        ...regularUser,
        role: regularRoleId,
      });

      const regularRegisterResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...regularUser,
          role: regularRoleId,
        });

      console.log(
        'Regular registration response status:',
        regularRegisterResponse.status,
      );
      console.log(
        'Regular registration response body:',
        regularRegisterResponse.body,
      );

      if (regularRegisterResponse.status !== 201) {
        console.error(
          'Regular user registration failed:',
          regularRegisterResponse.body,
        );
        throw new Error('Regular user registration failed');
      }

      regularUserJwtToken = regularRegisterResponse.body.token;
      console.log('Regular user registered.');
      console.log('Setup complete.');
    } catch (error) {
      console.error('Error in beforeAll:', error);
      // Make sure we clean up even if setup fails
      if (app) await app.close();
      throw error;
    }
  }, 120000); // Increase timeout to 2 minutes for setup

  afterAll(async () => {
    try {
      console.log('Starting cleanup...');
      if (dataSource && dataSource.isInitialized) {
        // Clean up test users and roles directly through repositories
        const userRepo = dataSource.getRepository(User);
        const roleRepo = dataSource.getRepository(Role);
        const permissionRepo = dataSource.getRepository(Permission);

        if (testUserId) {
          console.log(`Deleting test user: ${testUserId}`);
          await userRepo.delete(testUserId);
        }

        // Delete roles and permissions created for this test
        if (adminRoleId) {
          console.log(`Deleting admin role: ${adminRoleId}`);
          const adminRole = await roleRepo.findOne({
            where: { id: adminRoleId },
            relations: ['permission'],
          });
          if (adminRole) {
            await roleRepo.remove(adminRole);
            if (adminRole.permission) {
              await permissionRepo.delete(adminRole.permission.id);
            }
          }
        }

        if (regularRoleId) {
          console.log(`Deleting regular role: ${regularRoleId}`);
          const regularRole = await roleRepo.findOne({
            where: { id: regularRoleId },
            relations: ['permission'],
          });
          if (regularRole) {
            await roleRepo.remove(regularRole);
            if (regularRole.permission) {
              await permissionRepo.delete(regularRole.permission.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      if (app) {
        console.log('Closing app...');
        await app.close();
        console.log('App closed.');
      }
    }
  }, 60000);

  // Just run a single test initially to debug setup issues
  describe('Public Endpoints', () => {
    it('should register a new user', async () => {
      const testUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPass123!',
        role: regularRoleId,
      };

      console.log('Testing registration with:', testUser);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      console.log('Registration response status:', response.status);
      console.log('Registration response body:', response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');

      // Store ID for cleanup
      testUserId = response.body.user.id;
      console.log(`Test user created with ID: ${testUserId}`);
    }, 30000);
  });

  // Add more tests once the first one passes
});
