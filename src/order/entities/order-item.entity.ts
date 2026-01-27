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
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

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
