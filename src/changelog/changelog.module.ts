import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log/log.entity';
import { LogService } from './log/log.service';
import { LogInterceptor } from './log/log.interceptor';
import { LogController } from './log/log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService, LogInterceptor],
  controllers: [LogController],
  exports: [LogService, LogInterceptor],
})
export class ChangelogModule {}
