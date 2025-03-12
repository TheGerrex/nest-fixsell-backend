import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchOffice } from '../entities/branch-office.entity';
import { BaseClassificationService } from './base-classification.service';

@Injectable()
export class BranchOfficeService extends BaseClassificationService<BranchOffice> {
  constructor(
    @InjectRepository(BranchOffice)
    repository: Repository<BranchOffice>,
  ) {
    super(repository);
  }
}
