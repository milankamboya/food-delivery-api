import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { CustomerOrderController } from './customer-order.controller';
import { OwnerOrderController } from './owner-order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Meal } from '../restaurant/entities/meal.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderHistory,
      Meal,
      Restaurant,
    ]),
    CouponModule,
  ],
  providers: [OrderService],
  controllers: [CustomerOrderController, OwnerOrderController],
})
export class OrderModule {}
