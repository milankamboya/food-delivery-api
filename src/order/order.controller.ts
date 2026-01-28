import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(user.id, createOrderDto);
  }

  @Get('my-orders')
  findAllMyOrders(@CurrentUser() user: { id: string }) {
    return this.orderService.findAllByUser(user.id);
  }

  @Get('my-orders-raw')
  findAllMyOrdersRaw(@CurrentUser() user: { id: string }) {
    return this.orderService.findAllByUserRaw(user.id);
  }

  // Get orders for a specific restaurant (intended for owner)
  @Get('restaurant/:restaurantId')
  findAllByRestaurant(
    @CurrentUser() user: { id: string },
    @Param('restaurantId') restaurantId: string,
  ) {
    // In a real app, verify user.id is the owner of restaurantId
    return this.orderService.findAllByRestaurant(user.id, restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.orderService.getHistory(id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(
      user.id,
      id,
      updateOrderStatusDto.status,
    );
  }
}
