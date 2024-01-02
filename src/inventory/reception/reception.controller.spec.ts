import { Test, TestingModule } from '@nestjs/testing';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';

describe('ReceptionController', () => {
  let controller: ReceptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceptionController],
      providers: [ReceptionService],
    }).compile();

    controller = module.get<ReceptionController>(ReceptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
