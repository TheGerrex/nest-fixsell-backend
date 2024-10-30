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
}
