import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { MealService } from './meal.service';
import { Public } from 'src/common/decorators/public.decorator';
import { AppLoggerService } from 'src/common/logger/logger.service';
import { QueryDto } from 'src/common/dto/query.dto';

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
  async findAll(@Query() query: QueryDto) {
    this.logger.log('Fetching all restaurants');
    return this.restaurantService.findAll(query);
  }

  @Public()
  @Get(':id/meals')
  async getMeals(@Param('id') id: string, @Query() query: QueryDto) {
    this.logger.log(`Fetching meals for restaurant id: ${id}`);
    const restaurant = await this.restaurantService.findOne(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found or blocked');
    }
    return this.mealService.findAllByRestaurant(id, query);
  }
}
