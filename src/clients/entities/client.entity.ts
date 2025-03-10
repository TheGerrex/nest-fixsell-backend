import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CfdiAllowedValues } from '../interfaces/cfdi.interface';

@Entity({ name: 'clients' })
export class Client {
  //  uuid id of client
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Razon Social
  @Column('text')
  businessName: string;

  // Nombre comercial
  @Column('text', { nullable: true })
  commercialName: string;

  // RFC
  @Column('text', { unique: true })
  rfc: string;

  // calle
  @Column('text')
  street: string;

  // numero extorior
  @Column('text')
  exteriorNumber: string;

  // numero interior
  @Column('text', { nullable: true })
  interiorNumber: string;

  // Colonia
  @Column('text')
  neighborhood: string;

  // Uso de CFDI
  @Column('text')
  cfdiUse: CfdiAllowedValues;

  // retencion ISR
  @Column('boolean', { default: false })
  isrRetention: boolean;

  // localidad
  @Column('text')
  locality: string;

  // Municipio
  @Column('text')
  municipality: string;

  // estado
  @Column('text')
  state: string;

  // Pais
  @Column('text')
  country: string;

  // codigo postal
  @Column('text')
  postalCode: string;

  // referencia
  @Column('text', { nullable: true })
  reference: string;

  // representante legal
  @Column('text')
  legalRepresentative: string;

  // regimen Fiscal
  @Column('text')
  taxRegime: string;

  @Column('bool', { default: true })
  isActive: boolean;

  // timestamp created at and updated at
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
