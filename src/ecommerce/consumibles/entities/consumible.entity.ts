import { OrderDetail } from 'src/ecommerce/orderdetails/entities/orderdetail.entity';
import { Printer } from 'src/printers/entities/printer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Color } from '../color.enum';
import { Origen } from '../origen.enum';
import { Deal } from 'src/deals/entities/deal.entity';
@Entity()
export class Consumible {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand?: string;

  @Column('decimal')
  price: number;

  // currency: string;
  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  sku: string;

  // @Column('decimal')
  // weight: number;

  @Column({ type: 'enum', enum: Origen, nullable: true })
  origen: Origen;

  @Column('decimal', { nullable: true })
  volume: number;

  @Column('text', { nullable: true })
  longDescription: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true, array: true })
  compatibleModels: string[];

  @Column({
    type: 'enum',
    enum: Color,
    nullable: true,
  })
  color: Color;

  @Column('int', { nullable: true })
  yield: number;

  // @Column()
  // thumbnailImage: string;

  @Column('text', { array: true, nullable: true })
  img_url: string[];

  @Column({ nullable: true })
  category: string;

  // @Column('int')
  // stock: number;

  // @Column()
  // location: string;

  // Relations

  //printers many to many
  @ManyToMany(() => Printer, (printer) => printer.consumibles)
  printers: Printer[];

  //orderdetail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.consumible)
  orderDetails: OrderDetail[];

  @OneToMany(() => Consumible, (consumible) => consumible.counterpart)
  counterparts: Consumible[];

  @ManyToOne(() => Consumible, (consumible) => consumible.counterparts)
  counterpart: Consumible;

  @OneToOne(() => Deal, (deal) => deal.consumible, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  deal: Deal;
}
