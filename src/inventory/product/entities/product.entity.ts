import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductCategory } from 'src/inventory/product-categories/entities/product-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  buyable: boolean;

  @Column({ type: 'boolean' })
  sellable: boolean;

  @Column({ nullable: true })
  product_image: string;

  @Column()
  product_type: string;

  @Column({ type: 'double precision' })
  product_price: number;

  @Column()
  product_value: string;

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
  )
  product_category: ProductCategory;

  @Column()
  product_intern_id: string;

  @Column({ nullable: true })
  product_barcode: string;

  @Column({ nullable: true })
  product_sticker: string;
}
