import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),

    // postgresql
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
          synchronize: true,
          logging: true,
          ssl: isProduction ? {} : false,
        };

        if (isProduction) {
          // Add extra SSL configuration for production
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

    EmailModule,
    PrintersModule,
    AuthModule,
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
  ],
})
export class AppModule {}
