import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionZone } from '../entities/collection-zone.entity';
import { BaseClassificationService } from './base-classification.service';

@Injectable()
export class CollectionZoneService extends BaseClassificationService<CollectionZone> {
  constructor(
    @InjectRepository(CollectionZone)
    repository: Repository<CollectionZone>,
  ) {
    super(repository);
  }
}
