import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from 'src/ecommerce/orders/entities/order.entity';
import { Consumable } from 'src/ecommerce/consumables/entities/consumable.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @ManyToOne(() => Consumable, (consumable) => consumable.orderDetails)
  product: Consumable;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;
}
