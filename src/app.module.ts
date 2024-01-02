
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: +process.env.POSTGRES_DB_PORT,
      database: process.env.POSTGRES_DB_NAME,
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // postgresql
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     type: 'postgres',
    //     host: config.get<string>('POSTGRESS_HOST'),
    //     port: config.get<number>('POSTGRESS_PORT'),
    //     password: config.get<string>('POSTGRESS_PASSWORD'),
    //     username: config.get<string>('POSTGRESS_USER'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     database: config.get<string>('POSTGRESS_DB'),

    //     synchronize: true,
    //     logging: true,
    //     ssl: true,
    //     extra: {
    //       ssl: {
    //         rejectUnauthorized: false,
    //       },
    //     },
    //   }),
    // }),

    EmailModule,
    PrintersModule,
    AuthModule,
    ProductModule,
    ProductCategoriesModule,
    ProductOperationsLogisticsModule,
    ReceptionModule,
    DealsModule,
  ],
})
export class AppModule {}

