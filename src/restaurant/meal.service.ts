import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './entities/meal.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
  ) {}

  async findAllByRestaurant(restaurantId: string) {
    return this.mealRepository.find({
      where: {
        restaurantId,
        isObsolete: false,
      },
    });
  }
}
