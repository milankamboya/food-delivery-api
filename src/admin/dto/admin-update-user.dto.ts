import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
}
