import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { appendFile } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties not in the DTO
      forbidNonWhitelisted: true, // Allows extra properties instead of throwing an error
      transform: true, // Converts query params to DTO types
    }),
  );

  await app.listen(process.env.PORT || 3000);

  logger.log(process.env.NODE_ENV);
  logger.log(process.env.POSTGRES_DB_HOST);
  logger.log(process.env.HOST_API);
}

bootstrap();
