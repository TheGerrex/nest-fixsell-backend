import { OrderDetail } from 'src/ecommerce/orderdetails/entities/orderdetail.entity';
import { Printer } from 'src/printers/entities/printer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Consumible {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  weight: number;

  @Column('text')
  longDescription: string;

  @Column()
  shortDescription: string;

  @Column()
  thumbnailImage: string;

  @Column('simple-array')
  images: string[];

  @Column()
  category: string;

  @Column('int')
  stock: number;

  @Column()
  location: string;

  // Relations

  //printers many to many
  @ManyToMany(() => Printer, (printer) => printer.consumibles)
  printers: Printer[];

  //orderdetail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.consumible)
  orderDetails: OrderDetail[];
}
