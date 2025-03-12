import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessGroup } from '../entities/business-group.entity';
import { BaseClassificationService } from './base-classification.service';

@Injectable()
export class BusinessGroupService extends BaseClassificationService<BusinessGroup> {
  constructor(
    @InjectRepository(BusinessGroup)
    repository: Repository<BusinessGroup>,
  ) {
    super(repository);
  }
}
