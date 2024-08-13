import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateActivityDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  addedBy: User; // the user's ID

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  addedAt: Date;

  @IsOptional()
  @IsNumber()
  ticket: number; // the ticket's ID
}
