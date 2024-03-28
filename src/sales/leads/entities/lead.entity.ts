import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { SaleCommunication } from 'src/sales/sale-communication/entities/sale-communication.entity';

export enum Status {
  PROSPECT = 'prospect',
  // Add other statuses here
}

export enum ProductType {
  CONSUMABLE = 'consumible',
  PRINTER = 'printer',
  // Add other product types here
}

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.leads, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  assigned: User;

  @Column()
  product_interested: string;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  type_of_product: ProductType;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(
    () => SaleCommunication,
    (SaleCommunication) => SaleCommunication.lead,
  )
  communications: SaleCommunication[];
}
