import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CustomerOrderController {
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.orderService.getHistory(id);
  }
}
