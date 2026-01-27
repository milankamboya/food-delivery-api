import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrderModule } from 'src/order/order.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('DB_SERVER_HOST'),
        port: configService.get<number>('DB_SERVER_PORT'),
        username: configService.get<string>('DB_SERVER_USERNAME'),
        password: configService.get<string>('DB_SERVER_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    OrderModule,
    RestaurantModule,
    UserModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
