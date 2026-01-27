import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { User } from '../../user/entities/user.entity';
import { generateUuid } from '../../common/utils/uuid.util';

@Entity('order_status_history')
@Index('idx_status_history_order', ['orderId'])
@Index('idx_status_history_deleted', ['deletedAt', 'isObsolete'])
export class OrderHistory {
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

  @ManyToOne(() => Order, (order) => order.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({
    name: 'changed_by_user_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  changedByUserId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changed_by_user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

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
}
