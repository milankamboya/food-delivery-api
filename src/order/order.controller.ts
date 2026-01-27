import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req.user.id, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findAllMyOrders(@Request() req) {
    return this.orderService.findAllByUser(req.user.id);
  }

  // Get orders for a specific restaurant (intended for owner)
  @UseGuards(JwtAuthGuard)
  @Get('restaurant/:restaurantId')
  findAllByRestaurant(
    @Request() req,
    @Param('restaurantId') restaurantId: string,
  ) {
    // In a real app, verify req.user.id is the owner of restaurantId
    return this.orderService.findAllByRestaurant(req.user.id, restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.orderService.getHistory(id);
  }

  @UseGuards(JwtAuthGuard)
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
