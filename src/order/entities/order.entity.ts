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
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';
import { OrderItem } from './order-item.entity';
import { OrderHistory } from './order-history.entity';
import { generateUuid } from '../../common/utils/uuid.util';

import { OrderStatus } from './order-status.enum';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

@Entity('orders')
@Index('idx_orders_customer', ['customerUserId'])
@Index('idx_orders_restaurant', ['restaurantId'])
@Index('idx_orders_status', ['status'])
@Index('idx_orders_deleted', ['deletedAt', 'isObsolete'])
export class Order {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ name: 'customer_user_id', type: 'char', length: 36 })
  customerUserId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_user_id' })
  user: User; // mapped to customerUserId

  @Column({ name: 'restaurant_id', type: 'char', length: 36 })
  restaurantId: string;

  @ManyToOne(() => Restaurant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'coupon_id', type: 'char', length: 36, nullable: true })
  couponId: string | null;

  @ManyToOne(() => Coupon, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.order, {
    cascade: true,
  })
  history: OrderHistory[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tip_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  tipAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'char', length: 3, default: 'INR' })
  currency: string;

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
