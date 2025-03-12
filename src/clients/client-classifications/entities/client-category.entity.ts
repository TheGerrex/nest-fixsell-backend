import { Entity } from 'typeorm';
import { BaseClassification } from './base-classification.entity';

@Entity('client_categories')
export class ClientCategory extends BaseClassification {}
