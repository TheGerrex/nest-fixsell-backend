import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PrintersModule } from './printers/printers.module';
import { PrintersService } from './printers/printers.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    PrintersModule,
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
