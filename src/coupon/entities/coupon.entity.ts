import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { generateUuid } from '../../common/utils/uuid.util';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

@Entity('coupons')
@Index('idx_coupons_active', ['isActive'])
@Index('idx_coupons_deleted', ['deletedAt', 'isObsolete'])
export class Coupon {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ name: 'discount_percent', type: 'decimal', precision: 5, scale: 2 })
  discountPercent: number;

  @Column({
    name: DB_COLUMNS.IS_ACTIVE,
    type: DB_TYPES.TINYINT,
    width: 1,
    default: 1,
  })
  isActive: boolean;

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
