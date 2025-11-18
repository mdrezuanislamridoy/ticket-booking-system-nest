import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { cookieExtractor } from './cookie-extractor';
import { PrismaService } from 'src/prisma/prisma.service';

interface IUser {
  id: number;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }
  async validate(payload: IUser) {
    const { id } = payload;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ForbiddenException('Unauthorized user');
    }

    return payload;
  }
}
