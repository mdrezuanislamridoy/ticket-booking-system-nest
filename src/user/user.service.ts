import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { LoginUserDto } from './dto/loginUserDto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto) {
    const isUser = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUser) {
      throw new Error('User already exist');
    }

    const hashedPass = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPass,
      },
    });

    return {
      message: 'User created successfully',
      user,
    };
  }
  async loginUser(data: LoginUserDto, res) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatched = await bcrypt.compare(data.password, user.password);
    if (!isMatched) {
      throw new Error("Password didn't matched");
    }

    const { password, ...result } = user;

    const token = this.generateToken(user);

    res.cookie('token', token.accessToken, {
      httpOnly: true,
    });
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
    });
    return {
      message: 'User login successful',
      result,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async profile(req) {
    const { id } = req.user;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;

    return { user: result };
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH || 'refresh_secret',
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not available');
    }

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  private generateToken(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, role: user.role },
      {
        secret: (process.env.JWT_SECRET as string) || 'jsjlaiajf',
        expiresIn: '1h',
      },
    );
  }
  private generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: (process.env.JWT_REFRESH as string) || 'refresh_jldalkf',
        expiresIn: '7d',
      },
    );
  }
}
