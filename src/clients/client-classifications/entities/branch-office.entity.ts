import { Entity } from 'typeorm';
import { BaseClassification } from './base-classification.entity';

@Entity('branch_offices')
export class BranchOffice extends BaseClassification {}
