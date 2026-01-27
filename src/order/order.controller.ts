import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req.user.id, createOrderDto);
  }

  @Get('my-orders')
  findAllMyOrders(@Request() req) {
    return this.orderService.findAllByUser(req.user.id);
  }

  // Get orders for a specific restaurant (intended for owner)
  @Get('restaurant/:restaurantId')
  findAllByRestaurant(
    @Request() req,
    @Param('restaurantId') restaurantId: string,
  ) {
    // In a real app, verify req.user.id is the owner of restaurantId
    return this.orderService.findAllByRestaurant(req.user.id, restaurantId);
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
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(
      req.user.id,
      id,
      updateOrderStatusDto.status,
    );
  }
}
