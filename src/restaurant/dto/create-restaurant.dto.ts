import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  addressLine1?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
