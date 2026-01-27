import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { generateUuid } from '../../common/utils/uuid.util';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

@Entity('users')
@Index('idx_users_role', ['role'])
@Index('idx_users_deleted', ['deletedAt', 'isObsolete'])
export class User {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({
    name: DB_COLUMNS.IS_BLOCKED,
    type: DB_TYPES.TINYINT,
    width: 1,
    default: 0,
  })
  isBlocked: boolean;

  @DeleteDateColumn({
    name: DB_COLUMNS.DELETED_AT,
    type: DB_TYPES.DATETIME,
    precision: 3,
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({
    name: DB_COLUMNS.IS_OBSOLETE,
    type: DB_TYPES.TINYINT,
    width: 1,
    default: 0,
  })
  isObsolete: boolean;

  @CreateDateColumn({
    name: DB_COLUMNS.CREATED_AT,
    type: DB_TYPES.DATETIME,
    precision: 3,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: DB_COLUMNS.UPDATED_AT,
    type: DB_TYPES.DATETIME,
    precision: 3,
  })
  updatedAt: Date;
}
