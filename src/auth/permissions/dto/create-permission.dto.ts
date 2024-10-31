import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  //  website permissions
  // printers
  @IsBoolean()
  canCreatePrinter: boolean;
  @IsBoolean()
  canDeletePrinter: boolean;
  @IsBoolean()
  canUpdatePrinter: boolean;
  @IsBoolean()
  canViewPrinter: boolean;

  // consumables
  @IsBoolean()
  canCreateConsumable: boolean;
  @IsBoolean()
  canDeleteConsumable: boolean;
  @IsBoolean()
  canUpdateConsumable: boolean;
  @IsBoolean()
  canViewConsumable: boolean;

  // deals
  @IsBoolean()
  canCreateDeal: boolean;
  @IsBoolean()
  canDeleteDeal: boolean;
  @IsBoolean()
  canUpdateDeal: boolean;
  @IsBoolean()
  canViewDeal: boolean;

  // packages
  @IsBoolean()
  canCreatePackage: boolean;
  @IsBoolean()
  canDeletePackage: boolean;
  @IsBoolean()
  canUpdatePackage: boolean;
  @IsBoolean()
  canViewPackage: boolean;

  // leads
  @IsBoolean()
  canCreateLead: boolean;
  @IsBoolean()
  canDeleteLead: boolean;
  @IsBoolean()
  canUpdateLead: boolean;
  @IsBoolean()
  canViewLead: boolean;

  // user
  @IsBoolean()
  canCreateUser: boolean;
  @IsBoolean()
  canDeleteUser: boolean;
  @IsBoolean()
  canUpdateUser: boolean;
  @IsBoolean()
  canViewUser: boolean;

  // tickets
  @IsBoolean()
  canCreateTicket: boolean;
  @IsBoolean()
  canDeleteTicket: boolean;
  @IsBoolean()
  canUpdateTicket: boolean;
  @IsBoolean()
  canViewTicket: boolean;
  @IsBoolean()
  canManageUserConfig: boolean;

  // chat
  @IsBoolean()
  canCreateChat: boolean;
  @IsBoolean()
  canDeleteChat: boolean;
  @IsBoolean()
  canUpdateChat: boolean;
  @IsBoolean()
  canViewChat: boolean;
}
