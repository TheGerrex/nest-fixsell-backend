import { Entity } from 'typeorm';
import { BaseClassification } from './base-classification.entity';

@Entity('collection_zones')
export class CollectionZone extends BaseClassification {}
