import { OrderDetail } from 'src/ecommerce/orderdetails/entities/orderdetail.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Consumable {
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

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];
}
