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
} from 'typeorm';

import { Color } from '../color.enum';
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

  @Column('text')
  longDescription: string;

  @Column()
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

  @Column()
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

  @OneToOne(() => Consumible)
  @JoinColumn()
  counterpart: Consumible;
}
