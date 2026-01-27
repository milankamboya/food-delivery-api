import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Meal } from '../restaurant/entities/meal.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { CouponService } from '../coupon/coupon.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepository: Repository<OrderHistory>,
    private readonly couponService: CouponService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { restaurantId, items, tipAmount = 0, couponCode } = createOrderDto;

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const mealIds = items.map((i) => i.mealId);
    const meals = await this.mealRepository.find({
      where: { id: In(mealIds), restaurantId },
    });

    if (meals.length !== mealIds.length) {
      throw new BadRequestException(
        'Some meals not found or do not belong to the restaurant',
      );
    }

    const mealMap = new Map(meals.map((m) => [m.id, m]));
    let subtotal = 0;

    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const meal = mealMap.get(item.mealId);
      if (!meal) continue;
      const unitPrice = Number(meal.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      const orderItem = new OrderItem();
      orderItem.mealId = item.mealId;
      orderItem.quantity = item.quantity;
      orderItem.unitPrice = unitPrice;
      orderItem.lineTotal = lineTotal;
      orderItems.push(orderItem);
    }

    // Coupon logic
    let discountAmount = 0;
    let couponId: string | null = null;

    if (couponCode) {
      const coupon = await this.couponService.findByCode(couponCode);
      if (!coupon) {
        throw new NotFoundException('Invalid or inactive coupon code');
      }
      couponId = coupon.id;
      const discountPercent = Number(coupon.discountPercent);
      discountAmount = (subtotal * discountPercent) / 100;
    }

    const totalAmount = subtotal - discountAmount + tipAmount;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.customerUserId = userId;
      order.restaurantId = restaurantId;
      order.status = OrderStatus.PENDING;
      order.subtotal = subtotal;
      order.discountAmount = discountAmount;
      order.tipAmount = tipAmount;
      order.totalAmount = totalAmount;
      order.couponId = couponId;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(Order, order);

      const history = new OrderHistory();
      history.orderId = savedOrder.id;
      history.status = OrderStatus.PENDING;
      history.changedByUserId = userId;
      history.notes = 'Order placed';
      await queryRunner.manager.save(OrderHistory, history);

      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: string) {
    return this.orderRepository.find({
      where: { customerUserId: userId },
      relations: ['items', 'items.meal', 'restaurant', 'history'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByRestaurant(userId: string, restaurantId: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerUserId !== userId) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }

    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['items', 'items.meal', 'user', 'history'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.meal',
        'restaurant',
        'user',
        'coupon',
        'history',
        'history.user',
      ],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(userId: string, orderId: string, status: OrderStatus) {
    const order = await this.findOne(orderId);

    // Permission Logic
    let allowed = false;
    const currentStatus = order.status;
    const isCustomerOfOrder = order.customerUserId === userId;
    const isRestaurantOwner = order.restaurant.ownerUserId === userId;

    if (isCustomerOfOrder) {
      // Customer: PENDING -> CANCELLED
      if (
        currentStatus === OrderStatus.PENDING &&
        status === OrderStatus.CANCELLED
      ) {
        allowed = true;
      }
      // Customer: DELIVERED -> no explicit "RECEIVED" state in new SQL, assuming DELIVERED is final or similar flow.
      // Requirements said: Received: Once the customer receives the meal and marks it as received.
      // But SQL Enum is: 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
      // There is no RECEIVED. So removing that transition logic or mapping it if needed.
      // Assuming DELIVERED is the end for now based on SQL enum.
    }

    if (isRestaurantOwner) {
      // Owner can Cancel check
      if (
        status === OrderStatus.CANCELLED &&
        currentStatus !== OrderStatus.DELIVERED
      ) {
        allowed = true;
      }

      // PENDING -> CONFIRMED (instead of PROCESSING)
      if (
        currentStatus === OrderStatus.PENDING &&
        status === OrderStatus.CONFIRMED
      ) {
        allowed = true;
      }
      // CONFIRMED -> PREPARING
      if (
        currentStatus === OrderStatus.CONFIRMED &&
        status === OrderStatus.PREPARING
      ) {
        allowed = true;
      }
      // PREPARING -> OUT_FOR_DELIVERY (Instead of IN_ROUTE)
      if (
        currentStatus === OrderStatus.PREPARING &&
        status === OrderStatus.OUT_FOR_DELIVERY
      ) {
        allowed = true;
      }
      // OUT_FOR_DELIVERY -> DELIVERED
      if (
        currentStatus === OrderStatus.OUT_FOR_DELIVERY &&
        status === OrderStatus.DELIVERED
      ) {
        allowed = true;
      }
    }

    if (!allowed && !isRestaurantOwner && !isCustomerOfOrder) {
      throw new ForbiddenException('You are not allowed to access this order');
    }

    if (!allowed) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${status}`,
      );
    }

    // If not changed
    if (order.status === status) return order;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      order.status = status;
      await queryRunner.manager.save(Order, order);

      const history = new OrderHistory();
      history.orderId = order.id;
      history.status = status;
      history.changedByUserId = userId;
      history.notes = `Status changed to ${status}`;
      await queryRunner.manager.save(OrderHistory, history);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return this.findOne(order.id);
  }

  async getHistory(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderHistoryRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }
}
