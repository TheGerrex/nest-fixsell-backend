import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderDetail } from 'src/ecommerce/orderdetails/entities/orderdetail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column()
  shippingName: string;

  @Column()
  shippingAddress1: string;

  @Column()
  shippingAddress2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  shipped: boolean;

  @Column({ nullable: true })
  trackingNumber: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
