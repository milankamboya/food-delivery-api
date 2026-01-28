import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { MealService } from './meal.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, User } from '../user/entities/user.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './entities/meal.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
export class OwnerRestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mealService: MealService,
  ) {}

  // --- Restaurants ---

  @Get('restaurants')
  async getMyRestaurants(@CurrentUser() user: User) {
    return this.restaurantService.findAllByOwner(user.id);
  }

  @Get('restaurants/:id')
  async getRestaurant(@Param('id') id: string, @CurrentUser() user: User) {
    const restaurant = await this.restaurantService.findOne(id, true); // Owner sees blocked
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }
    return restaurant;
  }

  @Put('restaurants/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    const restaurant = await this.restaurantService.findOne(id, true);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    if (restaurant.isBlocked) {
      throw new ForbiddenException('Cannot update a blocked restaurant');
    }

    return this.restaurantService.update(id, dto);
  }

  // --- Meals ---

  @Get('meals/:id')
  async getMeal(@Param('id') id: string, @CurrentUser() user: User) {
    const meal = await this.mealService.findOne(id, true);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    const restaurant = await this.restaurantService.findOne(
      meal.restaurantId,
      true,
    );
    if (!restaurant || restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException(
        "You are not the owner of this meal's restaurant",
      );
    }
    return meal;
  }

  @Post('restaurants/:id/meals')
  async createMeal(
    @Param('id') restaurantId: string,
    @Body() dto: CreateMealDto,
    @CurrentUser() user: User,
  ) {
    const restaurant = await this.restaurantService.findOne(restaurantId, true);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    if (restaurant.isBlocked) {
      throw new ForbiddenException(
        'Cannot create a meal for a blocked restaurant',
      );
    }

    // Ensure the dto has the correct restaurantId
    // We cast to any or DeepPartial because the DTO might not strictly match the Entity structure
    const mealData = {
      ...dto,
      restaurantId: restaurantId,
    } as unknown as DeepPartial<Meal>;

    return this.mealService.create(mealData);
  }

  @Put('meals/:id')
  async updateMeal(
    @Param('id') id: string,
    @Body() dto: UpdateMealDto,
    @CurrentUser() user: User,
  ) {
    const meal = await this.mealService.findOne(id, true);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    // Check if the restaurant of this meal belongs to the user
    const restaurant = await this.restaurantService.findOne(
      meal.restaurantId,
      true,
    );
    if (!restaurant || restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException(
        "You are not the owner of this meal's restaurant",
      );
    }

    if (restaurant.isBlocked) {
      throw new ForbiddenException(
        'Cannot update a meal for a blocked restaurant',
      );
    }

    if (meal.isBlocked) {
      throw new ForbiddenException('Cannot update a blocked meal');
    }

    return this.mealService.update(id, dto);
  }

  @Delete('meals/:id')
  async deleteMeal(@Param('id') id: string, @CurrentUser() user: User) {
    const meal = await this.mealService.findOne(id, true);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    const restaurant = await this.restaurantService.findOne(
      meal.restaurantId,
      true,
    );
    if (!restaurant || restaurant.ownerUserId !== user.id) {
      throw new ForbiddenException(
        "You are not the owner of this meal's restaurant",
      );
    }

    if (restaurant.isBlocked) {
      throw new ForbiddenException(
        'Cannot delete a meal for a blocked restaurant',
      );
    }

    if (meal.isBlocked) {
      throw new ForbiddenException('Cannot delete a blocked meal');
    }

    return this.mealService.remove(id);
  }
}
