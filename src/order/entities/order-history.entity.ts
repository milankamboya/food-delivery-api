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
import { Order } from './order.entity';
import { OrderStatus } from './order-status.enum';
import { User } from '../../user/entities/user.entity';
import { generateUuid } from '../../common/utils/uuid.util';
import {
  DB_COLUMNS,
  DB_TYPES,
} from '../../common/constants/database.constants';

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

  @Column({ type: DB_TYPES.TEXT, nullable: true })
  notes: string | null;

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
}
