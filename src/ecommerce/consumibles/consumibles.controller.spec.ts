import { Test, TestingModule } from '@nestjs/testing';
import { ConsumiblesController } from './consumibles.controller';
import { ConsumiblesService } from './consumibles.service';

describe('ConsumiblesController', () => {
  let controller: ConsumiblesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumiblesController],
      providers: [ConsumiblesService],
    }).compile();

    controller = module.get<ConsumiblesController>(ConsumiblesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
