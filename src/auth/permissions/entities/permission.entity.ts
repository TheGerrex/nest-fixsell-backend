import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  // Website permissions
  // printers
  @Column({ default: false })
  canCreatePrinter: boolean;
  @Column({ default: false })
  canDeletePrinter: boolean;
  @Column({ default: false })
  canUpdatePrinter: boolean;
  @Column({ default: false })
  canViewPrinter: boolean;
  @Column({ default: false })
  canManagePrinterCRUD: boolean;

  //categories
  @Column({ default: false })
  canCreateCategory: boolean;
  @Column({ default: false })
  canDeleteCategory: boolean;
  @Column({ default: false })
  canUpdateCategory: boolean;
  @Column({ default: false })
  canViewCategory: boolean;

  //brands
  @Column({ default: false })
  canCreateBrand: boolean;
  @Column({ default: false })
  canDeleteBrand: boolean;
  @Column({ default: false })
  canUpdateBrand: boolean;
  @Column({ default: false })
  canViewBrand: boolean;

  // consumables
  @Column({ default: false })
  canCreateConsumable: boolean;
  @Column({ default: false })
  canDeleteConsumable: boolean;
  @Column({ default: false })
  canUpdateConsumable: boolean;
  @Column({ default: false })
  canViewConsumable: boolean;

  // deals
  @Column({ default: false })
  canCreateDeal: boolean;
  @Column({ default: false })
  canDeleteDeal: boolean;
  @Column({ default: false })
  canUpdateDeal: boolean;
  @Column({ default: false })
  canViewDeal: boolean;

  // packages
  @Column({ default: false })
  canCreatePackage: boolean;
  @Column({ default: false })
  canDeletePackage: boolean;
  @Column({ default: false })
  canUpdatePackage: boolean;
  @Column({ default: false })
  canViewPackage: boolean;

  // leads
  @Column({ default: false })
  canCreateLead: boolean;
  @Column({ default: false })
  canDeleteLead: boolean;
  @Column({ default: false })
  canUpdateLead: boolean;
  @Column({ default: false })
  canViewLead: boolean;
  @Column({ default: false })
  canViewAllLeads: boolean;
  @Column({ default: false })
  canBeAssignedToLead: boolean;

  // user
  @Column({ default: false })
  canCreateUser: boolean;
  @Column({ default: false })
  canDeleteUser: boolean;
  @Column({ default: false })
  canUpdateUser: boolean;
  @Column({ default: false })
  canViewUser: boolean;

  // tickets
  @Column({ default: false })
  canCreateTicket: boolean;
  @Column({ default: false })
  canDeleteTicket: boolean;
  @Column({ default: false })
  canUpdateTicket: boolean;
  @Column({ default: false })
  canViewTicket: boolean;
  @Column({ default: false })
  canManageUserConfig: boolean;
  @Column({ default: false })
  canViewAllTickets: boolean;

  // chat
  @Column({ default: false })
  canCreateChat: boolean;
  @Column({ default: false })
  canDeleteChat: boolean;
  @Column({ default: false })
  canUpdateChat: boolean;
  @Column({ default: false })
  canViewChat: boolean;

  // lead communications
  @Column({ default: false })
  canCreateLeadCommunication: boolean;
  @Column({ default: false })
  canDeleteLeadCommunication: boolean;
  @Column({ default: false })
  canUpdateLeadCommunication: boolean;
  @Column({ default: false })
  canViewLeadCommunication: boolean;

  //configs
  @Column({ default: false })
  canConfigureWebsite: boolean;

  @OneToOne(() => Role, (role) => role.permission, {
    cascade: ['insert', 'update'], // Enable cascading operations if needed
    nullable: true, // Allow null roles if necessary
  })
  role: Role;
}
