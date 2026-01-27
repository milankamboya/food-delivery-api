import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateMealDto } from '../../restaurant/dto/update-meal.dto';

export class AdminUpdateMealDto extends UpdateMealDto {
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
