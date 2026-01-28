import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from '../../auth/blacklist.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'fda-ejh6zUnk$WXU24%e',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException('No token found');
    }
    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is invalidated');
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  }
}
