import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../../common/constants/metadata.constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
