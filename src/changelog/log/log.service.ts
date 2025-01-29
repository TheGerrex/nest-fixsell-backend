import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async logAction(
    userId: string,
    userName: string, // New parameter
    action: string,
    entity: string,
    entityId: string,
    changes?: Record<string, any>,
    method?: string,
    url?: string,
    ip?: string,
  ) {
    const log = this.logRepository.create({
      userId,
      userName, // Set userName
      action,
      entity,
      entityId,
      changes,
      method,
      url,
      ip,
    });
    return this.logRepository.save(log);
  }

  async getAllLogs(limit = 1000, offset = 0) {
    return this.logRepository.find({
      skip: offset,
      take: limit,
      order: { timestamp: 'DESC' },
    });
  }

  async getLogById(id: number) {
    return this.logRepository.findOne({ where: { id } });
  }
}
