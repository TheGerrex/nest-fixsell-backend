import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCategory } from '../entities/client-category.entity';
import { BaseClassificationService } from './base-classification.service';

@Injectable()
export class ClientCategoryService extends BaseClassificationService<ClientCategory> {
  constructor(
    @InjectRepository(ClientCategory)
    repository: Repository<ClientCategory>,
  ) {
    super(repository);
  }
}
