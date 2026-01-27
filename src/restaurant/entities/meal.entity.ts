import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { generateUuid } from '../../common/utils/uuid.util';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

@Entity('meals')
@Index('idx_meals_restaurant', ['restaurantId'])
@Index('idx_meals_available', ['isAvailable'])
@Index('idx_meals_deleted', ['deletedAt', 'isObsolete'])
export class Meal {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ name: 'restaurant_id', type: 'char', length: 36 })
  restaurantId: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.meals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ length: 255 })
  name: string;

  @Column({ type: DB_TYPES.TEXT, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'char', length: 3, default: 'INR' })
  currency: string;

  @Column({
    name: DB_COLUMNS.IS_AVAILABLE,
    type: DB_TYPES.TINYINT,
    width: 1,
    default: 1,
  })
  isAvailable: boolean;

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
