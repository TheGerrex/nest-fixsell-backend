import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrintersModule } from './printers/printers.module';
import { PrintersService } from './printers/printers.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    PrintersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
