import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  //------------ Website permissions --------------//

  // printers
  @IsBoolean()
  canCreatePrinter: boolean;
  @IsBoolean()
  canDeletePrinter: boolean;
  @IsBoolean()
  canUpdatePrinter: boolean;
  @IsBoolean()
  canViewPrinter: boolean;
  @IsBoolean()
  canManagePrinterCRUD: boolean;

  //categories
  @IsBoolean()
  canCreateCategory: boolean;
  @IsBoolean()
  canDeleteCategory: boolean;
  @IsBoolean()
  canUpdateCategory: boolean;
  @IsBoolean()
  canViewCategory: boolean;

  //brands
  @IsBoolean()
  canCreateBrand: boolean;
  @IsBoolean()
  canDeleteBrand: boolean;
  @IsBoolean()
  canUpdateBrand: boolean;
  @IsBoolean()
  canViewBrand: boolean;

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

  // events
  @IsBoolean()
  canCreateEvent: boolean;
  @IsBoolean()
  canDeleteEvent: boolean;
  @IsBoolean()
  canUpdateEvent: boolean;
  @IsBoolean()
  canViewEvent: boolean;

  //------------ Sales permissions --------------//

  // leads
  @IsBoolean()
  canCreateLead: boolean;
  @IsBoolean()
  canDeleteLead: boolean;
  @IsBoolean()
  canUpdateLead: boolean;
  @IsBoolean()
  canViewLead: boolean;

  // clients
  @IsBoolean()
  canCreateClient: boolean;
  @IsBoolean()
  canDeleteClient: boolean;
  @IsBoolean()
  canUpdateClient: boolean;
  @IsBoolean()
  canViewClient: boolean;
  @IsBoolean()
  canViewAllClients: boolean;
  @IsBoolean()
  canBeAssignedToClient: boolean;

  //lead communications
  @IsBoolean()
  canCreateLeadCommunication: boolean;
  @IsBoolean()
  canDeleteLeadCommunication: boolean;
  @IsBoolean()
  canUpdateLeadCommunication: boolean;
  @IsBoolean()
  canViewLeadCommunication: boolean;
  @IsBoolean()
  canViewAllLeads: boolean;
  @IsBoolean()
  canBeAssignedToLead: boolean;

  //------------ Support permissions --------------//

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
  @IsBoolean()
  canViewAllTickets: boolean;

  //------------ Users permissions --------------//

  // user
  @IsBoolean()
  canCreateUser: boolean;
  @IsBoolean()
  canDeleteUser: boolean;
  @IsBoolean()
  canUpdateUser: boolean;
  @IsBoolean()
  canViewUser: boolean;

  //logs
  @IsBoolean()
  canViewLogs: boolean;

  //------------ Chat permissions --------------//

  // chat
  @IsBoolean()
  canCreateChat: boolean;
  @IsBoolean()
  canDeleteChat: boolean;
  @IsBoolean()
  canUpdateChat: boolean;
  @IsBoolean()
  canViewChat: boolean;

  //------------ Settings permissions --------------//

  // configs
  @IsBoolean()
  canConfigureWebsite: boolean;
  @IsBoolean()
  canConfigureSupport: boolean;
  @IsBoolean()
  canConfigureSales: boolean;
}
