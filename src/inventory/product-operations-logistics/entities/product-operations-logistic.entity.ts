import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductOperationsLogistic {
  //  id
  @PrimaryGeneratedColumn()
  id: number;
  // product
  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;
  // routes
  @Column({ type: 'text', nullable: true })
  routes: string | null;
  // product_responsable
  @Column({ type: 'text' })
  product_responsable: string;
  // product_weight
  @Column({ type: 'double precision' })
  product_weight: number;
  // product_volume
  @Column({ type: 'double precision' })
  product_volume: number;
  // product_delivery_time
  @Column({ type: 'int' })
  product_delivery_time: number;
}
