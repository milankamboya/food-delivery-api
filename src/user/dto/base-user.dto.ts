import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX } from '../../common/constants/regex.constants';
import { VALIDATION_MESSAGES } from '../../common/constants/messages.constants';

export class BaseUserDto {
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
}
