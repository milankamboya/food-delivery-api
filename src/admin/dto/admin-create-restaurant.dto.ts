import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRestaurantDto } from '../../restaurant/dto/create-restaurant.dto';

export class AdminCreateRestaurantDto extends CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  ownerUserId: string;
}
