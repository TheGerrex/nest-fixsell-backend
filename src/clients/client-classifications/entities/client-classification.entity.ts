import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';
import { BusinessGroup } from './business-group.entity';
import { CollectionZone } from './collection-zone.entity';
import { ClientCategory } from './client-category.entity';
import { BusinessLine } from './business-line.entity';
import { BranchOffice } from './branch-office.entity';

@Entity('client_classifications')
export class ClientClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Foreign key to Client
  @Column({ type: 'uuid' })
  clientId: string;

  @OneToOne(() => Client, (client) => client.classifications)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  // Relations to classification entities
  @ManyToOne(() => BusinessGroup, { nullable: true })
  @JoinColumn({ name: 'businessGroupId' })
  businessGroup: BusinessGroup;

  @Column({ type: 'uuid', nullable: true })
  businessGroupId: string;

  @ManyToOne(() => CollectionZone, { nullable: true })
  @JoinColumn({ name: 'collectionZoneId' })
  collectionZone: CollectionZone;

  @Column({ type: 'uuid', nullable: true })
  collectionZoneId: string;

  @ManyToOne(() => ClientCategory, { nullable: true })
  @JoinColumn({ name: 'clientCategoryId' })
  clientCategory: ClientCategory;

  @Column({ type: 'uuid', nullable: true })
  clientCategoryId: string;

  @ManyToOne(() => BusinessLine, { nullable: true })
  @JoinColumn({ name: 'businessLineId' })
  businessLine: BusinessLine;

  @Column({ type: 'uuid', nullable: true })
  businessLineId: string;

  @ManyToOne(() => BranchOffice, { nullable: true })
  @JoinColumn({ name: 'branchOfficeId' })
  branchOffice: BranchOffice;

  @Column({ type: 'uuid', nullable: true })
  branchOfficeId: string;
}
