import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../../auth/entities/user.entity';
import { SaleCommunication } from 'src/sales/sale-communication/entities/sale-communication.entity';

export enum Status {
  PROSPECT = 'prospect',
  // Add other statuses here
}

export enum ProductType {
  CONSUMABLE = 'consumible',
  PRINTER = 'printer',
  RENT_PACKAGE = 'rent_package',
  PROMOTION = 'promotion',
  SOFTWARE = 'software',
  // Add other product types here
}

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  client: string;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: true,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.leads, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  assigned: User;

  @Column({ nullable: true })
  product_interested: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: true,
  })
  type_of_product: ProductType;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(
    () => SaleCommunication,
    (SaleCommunication) => SaleCommunication.lead,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  communications: SaleCommunication[];
}
