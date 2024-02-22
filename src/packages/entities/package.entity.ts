import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Printer } from 'src/printers/entities/printer.entity';

@Entity()
export class Package {
  //   id
  @PrimaryGeneratedColumn()
  id: number;
  // printer id relation
  @ManyToOne(() => Printer, (printer) => printer.packages)
  printer: Printer;

  // number of months
  @Column({ type: 'int', nullable: true })
  packageDuration: number;

  // price per year
  @Column({ type: 'decimal', nullable: true })
  packagePrice: number;

  // currency
  @Column({ nullable: true })
  packageCurrency: string;

  // package End Date
  @Column({ type: 'timestamp', nullable: true })
  packageEndDate: Date;

  // package start date
  @Column({ type: 'timestamp', nullable: true })
  packageStartDate: Date;

  // discount percentage
  @Column({ type: 'decimal', nullable: true })
  packageDiscountPercentage: number;

  // description
  @Column({ type: 'text', nullable: true })
  packageDescription: string;

  // numero de impresiones
  @Column({ type: 'int', nullable: true })
  packagePrints: number;

  // precio por click extra
  @Column({ type: 'decimal', nullable: true })
  packageExtraClickPrice: number;

  //precio deposito
  @Column({ type: 'decimal', nullable: true })
  packageDepositPrice: number;

  // includes array
  @Column({ type: 'text', array: true, nullable: true })
  packageIncludes: string[];
}
