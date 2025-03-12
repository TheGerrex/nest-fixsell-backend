import { Entity } from 'typeorm';
import { BaseClassification } from './base-classification.entity';

@Entity('business_groups')
export class BusinessGroup extends BaseClassification {}
