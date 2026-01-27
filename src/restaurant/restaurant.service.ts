import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findAll(includeBlocked = false) {
    const where: FindOptionsWhere<Restaurant> = {
      isObsolete: false,
    };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.restaurantRepository.find({
      where,
    });
  }

  async findOne(id: string, includeBlocked = false) {
    const where: FindOptionsWhere<Restaurant> = { id, isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.restaurantRepository.findOne({
      where,
    });
  }

  async create(restaurantData: DeepPartial<Restaurant>) {
    const restaurant = this.restaurantRepository.create(restaurantData);
    return this.restaurantRepository.save(restaurant);
  }

  async update(id: string, updateData: DeepPartial<Restaurant>) {
    const restaurant = await this.findOne(id, true);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    await this.restaurantRepository.save({ ...restaurant, ...updateData });
    return this.findOne(id, true);
  }

  async remove(id: string) {
    const restaurant = await this.findOne(id, true);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    await this.restaurantRepository.softDelete(id);
    return { success: true };
  }
}
