import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MealService } from '../restaurant/meal.service';
import { Meal } from '../restaurant/entities/meal.entity';
import { UserService } from '../user/user.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { AdminCreateRestaurantDto } from './dto/admin-create-restaurant.dto';
import { AdminUpdateRestaurantDto } from './dto/admin-update-restaurant.dto';
import { CreateMealDto } from '../restaurant/dto/create-meal.dto';
import { AdminUpdateMealDto } from './dto/admin-update-meal.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mealService: MealService,
    private readonly userService: UserService,
  ) {}

  // --- Restaurants ---

  @Get('restaurants')
  getAllRestaurants() {
    return this.restaurantService.findAll(true);
  }

  @Post('restaurants')
  createRestaurant(@Body() dto: AdminCreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }

  @Put('restaurants/:id')
  updateRestaurant(
    @Param('id') id: string,
    @Body() dto: AdminUpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, dto);
  }

  @Delete('restaurants/:id')
  deleteRestaurant(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }

  // --- Meals ---

  @Get('restaurants/:id/meals')
  getMealsByRestaurant(@Param('id') id: string) {
    return this.mealService.findAllByRestaurant(id, true);
  }

  @Get('meals/:id')
  getMeal(@Param('id') id: string) {
    return this.mealService.findOne(id, true);
  }

  @Post('meals')
  createMeal(@Body() dto: CreateMealDto) {
    return this.mealService.create(dto as unknown as DeepPartial<Meal>);
  }

  @Put('meals/:id')
  updateMeal(@Param('id') id: string, @Body() dto: AdminUpdateMealDto) {
    return this.mealService.update(id, dto);
  }

  @Delete('meals/:id')
  deleteMeal(@Param('id') id: string) {
    return this.mealService.remove(id);
  }

  // --- Users ---

  @Get('users')
  getAllUsers() {
    return this.userService.findAll(true);
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
