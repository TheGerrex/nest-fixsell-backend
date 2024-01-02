import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from 'src/inventory/product/entities/product.entity';

export enum Status {
  BORRADOR = 'BORRADOR',
  HECHO = 'HECHO',
  PREPARADO = 'PREPARADO',
  CANCELADO = 'CANCELADO',
}

@Entity()
export class Reception {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receive_from: string;

  @Column()
  operation_type: string;

  @Column()
  expected_date: Date;

  @Column()
  document_origin: string;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column()
  responsible: string;

  @Column()
  notes: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.BORRADOR,
  })
  status: Status;
}
