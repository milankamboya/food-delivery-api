import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { MealService } from './meal.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mealService: MealService,
  ) {}

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id/meals')
  async getMeals(@Param('id') id: string) {
    return this.mealService.findAllByRestaurant(id);
  }
}
