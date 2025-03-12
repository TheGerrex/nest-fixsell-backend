import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { ClientClassification } from './entities/client-classification.entity';
import { BusinessGroup } from './entities/business-group.entity';
import { CollectionZone } from './entities/collection-zone.entity';
import { ClientCategory } from './entities/client-category.entity';
import { BusinessLine } from './entities/business-line.entity';
import { BranchOffice } from './entities/branch-office.entity';

import { BusinessGroupService } from './services/business-group.service';
import { CollectionZoneService } from './services/collection-zone.service';
import { ClientCategoryService } from './services/client-category.service';
import { BusinessLineService } from './services/business-line.service';
import { BranchOfficeService } from './services/branch-office.service';
import { ClientClassificationsService } from './client-classifications.service';

import { ClientCategoryController } from './controllers/client-category.controller';
import { ClientClassificationsController } from './client-classifications.controller';
import { BusinessGroupController } from './controllers/business-group.controller';
import { CollectionZoneController } from './controllers/collection-zone.controller';
import { BusinessLineController } from './controllers/business-line.controller';
import { BranchOfficeController } from './controllers/branch-office.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      ClientClassification, // <-- Added this entity.
      BusinessGroup,
      CollectionZone,
      ClientCategory,
      BusinessLine,
      BranchOffice,
    ]),
  ],
  controllers: [
    BusinessGroupController,
    CollectionZoneController,
    ClientCategoryController,
    BusinessLineController,
    BranchOfficeController,
    ClientClassificationsController,
  ],
  providers: [
    BusinessGroupService,
    CollectionZoneService,
    ClientCategoryService,
    BusinessLineService,
    BranchOfficeService,
    ClientClassificationsService,
  ],
  exports: [
    BusinessGroupService,
    CollectionZoneService,
    ClientCategoryService,
    BusinessLineService,
    BranchOfficeService,
    ClientClassificationsService,
  ],
})
export class ClientClassificationsModule {}
