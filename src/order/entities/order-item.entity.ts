import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { Meal } from '../../restaurant/entities/meal.entity';
import { generateUuid } from '../../common/utils/uuid.util';

@Entity('order_items')
@Index('idx_order_items_order', ['orderId'])
@Index('idx_order_items_meal', ['mealId'])
@Index('idx_order_items_deleted', ['deletedAt', 'isObsolete'])
export class OrderItem {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateUuid();
    }
  }

  @Column({ name: 'order_id', type: 'char', length: 36 })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'meal_id', type: 'char', length: 36 })
  mealId: string;

  @ManyToOne(() => Meal, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 10, scale: 2 })
  lineTotal: number;

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
