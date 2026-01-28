import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { MealService } from './meal.service';
import { Public } from 'src/common/decorators/public.decorator';
import { AppLoggerService } from 'src/common/logger/logger.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mealService: MealService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(RestaurantController.name);
  }

  @Public()
  @Get()
  async findAll() {
    this.logger.log('Fetching all restaurants');
    return this.restaurantService.findAll();
  }

  @Public()
  @Get(':id/meals')
  async getMeals(@Param('id') id: string) {
    this.logger.log(`Fetching meals for restaurant id: ${id}`);
    return this.mealService.findAllByRestaurant(id);
  }
}
