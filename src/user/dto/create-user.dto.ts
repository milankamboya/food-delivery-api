import { REGEX } from '../../common/constants/regex.constants';
import { VALIDATION_MESSAGES } from '../../common/constants/messages.constants';

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(24)
  @Matches(REGEX.PASSWORD, {
    message: VALIDATION_MESSAGES.PASSWORD_COMPLEXITY,
  })
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
