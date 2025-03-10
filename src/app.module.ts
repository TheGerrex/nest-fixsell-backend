import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard'; // Import AuthGuard
import { PermissionsGuard } from './auth/permissions/permissions.guard';
import { PermissionsModule } from './auth/permissions/permissions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PrintersModule } from './printers/printers.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ProductModule } from './inventory/product/product.module';
import { ProductCategoriesModule } from './inventory/product-categories/product-categories.module';
import { ProductOperationsLogisticsModule } from './inventory/product-operations-logistics/product-operations-logistics.module';
import { ReceptionModule } from './inventory/reception/reception.module';
import { DealsModule } from './deals/deals.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { CommonModule } from './common/common.module';
import { ConsumiblesModule } from './ecommerce/consumibles/consumibles.module';
import { OrdersModule } from './ecommerce/orders/orders.module';
import { OrderdetailsModule } from './ecommerce/orderdetails/orderdetails.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PackagesModule } from './packages/packages.module';
import { LeadsModule } from './sales/leads/leads.module';
import { SaleCommunicationModule } from './sales/sale-communication/sale-communication.module';
import { TicketsModule } from './tickets/tickets.module';
import { ActivityModule } from './activity/activity.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CurrencyModule } from './currency/currency.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesModule } from './auth/roles/roles.module';
import { SoftwaresModule } from './softwares/softwares.module';
import { EventsModule } from './events/events.module';
import { ChangelogModule } from './changelog/changelog.module';
import { LogInterceptor } from './changelog/log/log.interceptor'; // Import LogInterceptor
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    // PostgreSQL Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        const baseConfig = {
          type: 'postgres',
          host: config.get<string>('POSTGRES_DB_HOST'),
          port: config.get<number>('POSTGRES_DB_PORT'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          username: config.get<string>('POSTGRES_DB_USERNAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          database: config.get<string>('POSTGRES_DB_NAME'),
          synchronize: true, // Set to false in production
          logging: true,
          ssl: isProduction ? {} : false,
        };

        if (isProduction) {
          // Extra SSL configuration for production
          baseConfig.ssl = {
            rejectUnauthorized: false,
            trustServerCertificate: true,
            Encrypt: true,
            IntegratedSecurity: false,
          };
        }

        return baseConfig as TypeOrmModuleOptions;
      },
    }),
    // Application Modules
    EmailModule,
    PrintersModule,
    AuthModule,
    PermissionsModule, // Added PermissionsModule
    RolesModule,
    ProductModule,
    ProductCategoriesModule,
    ProductOperationsLogisticsModule,
    ReceptionModule,
    DealsModule,
    SeedModule,
    CommonModule,
    ConsumiblesModule,
    OrdersModule,
    OrderdetailsModule,
    FileUploadModule,
    PackagesModule,
    LeadsModule,
    SaleCommunicationModule,
    TicketsModule,
    ActivityModule,
    ChatbotModule,
    CurrencyModule,
    ScheduleModule.forRoot(),
    SoftwaresModule,
    EventsModule,
    ChangelogModule,
    ClientsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Register AuthGuard globally first
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard, // Register PermissionsGuard globally next
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor, // Register LogInterceptor globally
    },
    // ... other providers
  ],
})
export class AppModule {}
