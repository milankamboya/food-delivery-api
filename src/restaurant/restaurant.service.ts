import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findAll() {
    return this.restaurantRepository.find({
      where: {
        isObsolete: false,
      },
    });
  }

  async findOne(id: string) {
    return this.restaurantRepository.findOne({
      where: { id, isObsolete: false },
    });
  }
}
