import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async findByCode(code: string): Promise<Coupon | null> {
    return this.couponRepository.findOne({
      where: {
        code,
        isActive: true,
        isObsolete: false,
      },
    });
  }
}
