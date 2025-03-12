import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLine } from '../entities/business-line.entity';
import { BaseClassificationService } from './base-classification.service';

@Injectable()
export class BusinessLineService extends BaseClassificationService<BusinessLine> {
  constructor(
    @InjectRepository(BusinessLine)
    repository: Repository<BusinessLine>,
  ) {
    super(repository);
  }
}
