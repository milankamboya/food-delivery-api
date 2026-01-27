import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { MealService } from './meal.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mealService: MealService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Public()
  @Get(':id/meals')
  async getMeals(@Param('id') id: string) {
    return this.mealService.findAllByRestaurant(id);
  }
}
