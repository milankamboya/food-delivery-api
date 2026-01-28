import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('signup')
  async signupCustomer(@Body() signupDto: SignupDto) {
    return this.userService.create({
      ...signupDto,
      role: UserRole.CUSTOMER,
    });
  }

  @Public()
  @Post('signup/restaurant')
  async signupRestaurant(@Body() signupDto: SignupDto) {
    return this.userService.create({
      ...signupDto,
      role: UserRole.OWNER,
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.logout(token, req.user.exp);
    }
    return { message: 'Logged out successfully' };
  }
}
