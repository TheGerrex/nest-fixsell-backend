import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from 'src/ecommerce/orders/entities/order.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Consumible, (consumible) => consumible.orderDetails, {
    eager: true,
  })
  consumible: Consumible;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;
}
