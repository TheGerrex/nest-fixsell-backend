import { Entity } from 'typeorm';
import { BaseClassification } from './base-classification.entity';

@Entity('business_lines')
export class BusinessLine extends BaseClassification {}
