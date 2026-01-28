import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './entities/restaurant.entity';
import { Meal } from './entities/meal.entity';
import { MealService } from './meal.service';

import { OwnerRestaurantController } from './owner-restaurant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Meal])],
  providers: [RestaurantService, MealService],
  controllers: [RestaurantController, OwnerRestaurantController],
  exports: [RestaurantService, MealService],
})
export class RestaurantModule {}
