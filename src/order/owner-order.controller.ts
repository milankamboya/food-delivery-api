import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('owner/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class OwnerOrderController {
  constructor(private readonly orderService: OrderService) {}

  // Get orders for a specific restaurant (intended for owner)
  @Get('restaurant/:restaurantId')
  findAllByRestaurant(
    @CurrentUser() user: { id: string },
    @Param('restaurantId') restaurantId: string,
  ) {
    // In a real app, verify user.id is the owner of restaurantId
    return this.orderService.findAllByRestaurant(user.id, restaurantId);
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
