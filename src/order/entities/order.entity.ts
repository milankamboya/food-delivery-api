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

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  // Below mappings are just to keep code compilation safe if they were used
  // But ideally we should remove them eventually.
  // PLACED -> PENDING
  // PROCESSING -> PREPARING
  // IN_ROUTE -> OUT_FOR_DELIVERY
  // PREVIOUS_VALUE -> NEW_VALUE as per SQL
}

// Helper to keep old code working if needed, or we just change the enum.
// The user provided SQL defines:
// ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
// So we must use exactly this set.

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
    name: 'deleted_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({ name: 'is_obsolete', type: 'tinyint', width: 1, default: 0 })
  isObsolete: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt: Date;
}
