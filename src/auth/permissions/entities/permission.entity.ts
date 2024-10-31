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

  // chat
  @Column({ default: false })
  canCreateChat: boolean;
  @Column({ default: false })
  canDeleteChat: boolean;
  @Column({ default: false })
  canUpdateChat: boolean;
  @Column({ default: false })
  canViewChat: boolean;

  @OneToOne(() => Role, (role) => role.permission, {
    cascade: ['insert', 'update'], // Enable cascading operations if needed
    nullable: true, // Allow null roles if necessary
  })
  role: Role;
}
