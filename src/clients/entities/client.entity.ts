import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientPrinter } from '../client-printers/entities/client-printer.entity';
import { ClientAccount } from '../client-accounts/entities/client-account.entity';
import { ClientContact } from '../client-contacts/entities/client-contact.entity';
import { ClientShippingAddress } from '../client-shipping-addresses/entities/client-shipping-address.entity';
import { ClientBillingAddress } from '../client-billing-addresses/entities/client-billing-address.entity';
import { ClientSuspensionConfig } from '../client-suspension-configs/entities/client-suspension-config.entity';
import { ClientCommercialCondition } from '../client-commercial-conditions/entities/client-commercial-condition.entity';
import { ClientClassification } from '../client-classifications/entities/client-classification.entity';
import { TaxRegimeInterface } from '../interfaces/tax_regime.interface';
import { CfdiInterface } from '../interfaces/cfdi.interface';

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
  @Column('json', { default: () => "'{}'" })
  cfdiUse: CfdiInterface;

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
  @Column('json', { default: () => "'{}'" })
  taxRegime: TaxRegimeInterface;

  @Column('boolean', { default: true })
  isActive: boolean;

  @OneToMany(() => ClientPrinter, (clientPrinter) => clientPrinter.client, {
    cascade: true,
  })
  clientPrinters: ClientPrinter[];

  // timestamp created at and updated at
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Client has many accounts (One to Many)
  @OneToMany(() => ClientAccount, (account) => account.client)
  accounts: ClientAccount[];

  // Client has many contacts (One to Many)
  @OneToMany(() => ClientContact, (contact) => contact.client)
  contacts: ClientContact[];

  // Client has many shipping addresses (One to Many)
  @OneToMany(() => ClientShippingAddress, (address) => address.client)
  shippingAddresses: ClientShippingAddress[];

  // Client has many billing addresses (One to Many)
  @OneToMany(() => ClientBillingAddress, (address) => address.client)
  billingAddresses: ClientBillingAddress[];

  @OneToOne(() => ClientSuspensionConfig, (config) => config.client, {
    cascade: true,
  })
  suspensionConfig: ClientSuspensionConfig;

  @OneToOne(
    () => ClientCommercialCondition,
    (conditions) => conditions.client,
    { cascade: true },
  )
  commercialConditions: ClientCommercialCondition;

  @OneToOne(
    () => ClientClassification,
    (classification) => classification.client,
    {
      cascade: true,
    },
  )
  classifications: ClientClassification;
}
