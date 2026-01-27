import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RestaurantModule, UserModule],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
