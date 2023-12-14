import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrintersModule } from './printers/printers.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),

    // postgresql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: process.env.POSTGRESS_HOST,
        port: 5432,
        password: process.env.POSTGRES_PASSWORD,
        username: 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        database: 'fixsell_erp',

        synchronize: true,
        logging: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    EmailModule,
    PrintersModule,
    AuthModule,
  ],
})
export class AppModule {}
