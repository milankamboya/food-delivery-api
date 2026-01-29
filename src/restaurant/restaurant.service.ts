import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, DeepPartial, ILike } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { QueryDto } from '../common/dto/query.dto';
import { parseFieldSelection } from '../common/utils/query-parser.util';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findAll(query: QueryDto, fields?: string, includeBlocked = false) {
    const { search, page = 1, limit = 10, sortOrder } = query;
    const skip = (page - 1) * limit;
    const select = parseFieldSelection<Restaurant>(fields || '');

    const where: FindOptionsWhere<Restaurant> = {
      isObsolete: false,
    };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    return this.restaurantRepository.find({
      where,
      select,
      skip,
      take: limit,
      order: sortOrder ? { updatedAt: sortOrder } : undefined,
    });
  }

  async findAllByOwner(ownerUserId: string, query: QueryDto) {
    const { search, page = 1, limit = 10, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Restaurant> = {
      ownerUserId,
      isObsolete: false,
    };
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    return this.restaurantRepository.find({
      where,
      skip,
      take: limit,
      order: sortOrder ? { updatedAt: sortOrder } : undefined,
    });
  }

  async findOne(id: string, includeBlocked = false) {
    const where: FindOptionsWhere<Restaurant> = { id, isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.restaurantRepository.findOne({
      where,
      relations: ['meals'],
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
    const result = await this.restaurantRepository.update(id, {
      deletedAt: new Date(),
      isObsolete: true,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return {
      message: `Restaurant with ID ${id} has been soft deleted and marked obsolete`,
    };
  }
}
