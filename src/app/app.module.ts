import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { MealModule } from 'src/meal/meal.module';
import { OrderModule } from 'src/order/order.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [AuthModule, MealModule, OrderModule, RestaurantModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
