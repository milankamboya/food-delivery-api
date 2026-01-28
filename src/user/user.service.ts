import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string, includeBlocked = false) {
    const where: FindOptionsWhere<User> = { email, isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.userRepository.findOne({ where });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
    });

    return this.userRepository.save(user);
  }

  async findAll(includeBlocked = false) {
    const where: FindOptionsWhere<User> = { isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    return this.userRepository.find({ where });
  }

  async update(id: string, updateData: DeepPartial<User>) {
    const user = await this.findOne(id, true); // Admin update might target blocked user
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin users cannot be updated');
    }

    await this.userRepository.save({ ...user, ...updateData });
    return this.findOne(id, true);
  }

  async findOne(id: string, includeBlocked = false) {
    const where: FindOptionsWhere<User> = { id, isObsolete: false };
    if (!includeBlocked) {
      where.isBlocked = false;
    }
    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id, true);

    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin users cannot be deleted');
    }

    const result = await this.userRepository.update(id, {
      deletedAt: new Date(),
      isObsolete: true,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      message: `User with ID ${id} has been soft deleted and marked obsolete`,
    };
  }
}
