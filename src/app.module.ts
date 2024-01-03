
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRES_DB_HOST,
    //   port: +process.env.POSTGRES_DB_PORT,
    //   database: process.env.POSTGRES_DB_NAME,
    //   username: process.env.POSTGRES_DB_USERNAME,
    //   password: process.env.POSTGRES_PASSWORD,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    // postgresql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_DB_HOST'),
        port: config.get<number>('POSTGRES_DB_PORT'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        username: config.get<string>('POSTGRES_DB_USERNAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        database: config.get<string>('POSTGRES_DB_NAME'),
        synchronize: true,
        logging: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
            trustServerCertificate: true,
            Encrypt: true,
            IntegratedSecurity: false,
          },
        },
      }),
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
  ],
})
export class AppModule {}

