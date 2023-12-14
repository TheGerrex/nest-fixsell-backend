import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  @ManyToOne(
    () => ProductCategory,
    (parent_category) => parent_category.child_categories,
  )
  parent_category: ProductCategory;

  @OneToMany(
    () => ProductCategory,
    (child_category) => child_category.parent_category,
  )
  child_categories: ProductCategory[];

  @Column({
    type: 'enum',
    enum: ['fifo', 'lifo', 'nearest', 'least packages'],
    default: 'fifo',
  })
  withdrawal_strategy: 'fifo' | 'lifo' | 'nearest' | 'least packages';

  @OneToMany(() => Product, (product) => product.product_category)
  products: Product[];
}
