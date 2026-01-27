import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateRestaurantDto } from '../../restaurant/dto/update-restaurant.dto';

export class AdminUpdateRestaurantDto extends UpdateRestaurantDto {
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
