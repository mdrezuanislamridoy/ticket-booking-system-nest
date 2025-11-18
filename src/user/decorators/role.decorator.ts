import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLE_STR = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLE_STR, roles);
