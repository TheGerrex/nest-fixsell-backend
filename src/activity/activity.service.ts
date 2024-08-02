import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity>  {
    const activity = new Activity();
    activity.text = createActivityDto.text;
    activity.addedAt = createActivityDto.addedAt;

    // Validate the UUID
    if (!isUUID(createActivityDto.addedBy)) {
      throw new BadRequestException(`Formato UUID inválido: ${createActivityDto.addedBy}`);
    }
  
    // Find the user who added the activity
    const user = await this.usersRepository.findOne({
      where: { id: createActivityDto.addedBy },
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado con el id: ${createActivityDto.addedBy}`);
    }
  
    activity.addedBy = user;
  
    // Save the activity
    await this.activitiesRepository.save(activity);
  
    return activity;
  }

  async findAll(): Promise<Activity[]> {
    return this.activitiesRepository.find({ relations: ['addedBy'] });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ where: { id }, relations: ['addedBy'] });

    if (!activity) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }
  
    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {

    // Validate the UUID
    if (!isUUID(updateActivityDto.addedBy)) {
      throw new BadRequestException(`Formato UUID inválido: ${updateActivityDto.addedBy}`);
    }

    // Find the user who added the activity
    const user = await this.usersRepository.findOne({
      where: { id: updateActivityDto.addedBy },
    });

    if (!user) {
      throw new NotFoundException(`Usuario no encontrado con el id: ${updateActivityDto.addedBy}`);
    }
  
    await this.activitiesRepository.update(id, { ...updateActivityDto, addedBy: user });
  
    const updatedActivity = await this.activitiesRepository.findOne({ where: { id } });

    if (!updatedActivity) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }
  
    return updatedActivity;
  }

  async remove(id: number): Promise<void> {
    const result = await this.activitiesRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }
  }
}
