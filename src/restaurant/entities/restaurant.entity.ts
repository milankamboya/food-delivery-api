import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Meal } from './meal.entity';
import { generateUuid } from '../../common/utils/uuid.util';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

@Entity('restaurants')
@Index('idx_restaurants_owner', ['ownerUserId'])
@Index('idx_restaurants_active', ['isActive'])
@Index('idx_restaurants_deleted', ['deletedAt', 'isObsolete'])
export class Restaurant {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ name: 'owner_user_id', type: 'char', length: 36 })
  ownerUserId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;

  @Column({ length: 255 })
  name: string;

  @Column({ type: DB_TYPES.TEXT, nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({
    name: DB_COLUMNS.IS_ACTIVE,
    type: DB_TYPES.TINYINT,
    width: 1,
    default: 1,
  })
  isActive: boolean;

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

  @OneToMany(() => Meal, (meal) => meal.restaurant)
  meals: Meal[];
}
