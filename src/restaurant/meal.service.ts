import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { Meal } from './entities/meal.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
  ) {}

  async findAllByRestaurant(restaurantId: string, includeBlocked = false) {
    const where: FindOptionsWhere<Meal> = {
      restaurantId,
      isObsolete: false,
    };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.mealRepository.find({
      where,
    });
  }

  async findOne(id: string, includeBlocked = false) {
    const where: FindOptionsWhere<Meal> = { id, isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.mealRepository.findOne({
      where,
    });
  }

  async create(mealData: DeepPartial<Meal>) {
    const meal = this.mealRepository.create(mealData);
    return this.mealRepository.save(meal);
  }

  async update(id: string, updateData: DeepPartial<Meal>) {
    const meal = await this.findOne(id, true);
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    await this.mealRepository.save({ ...meal, ...updateData });
    return this.findOne(id, true);
  }

  async remove(id: string) {
    const meal = await this.findOne(id, true);
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    await this.mealRepository.softDelete(id);
    return { success: true };
  }
}
