import { OrderStatus } from '../entities/order-status.enum';

export class OrderRawDto {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  restaurantName: string;
}
