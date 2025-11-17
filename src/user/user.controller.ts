import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { LoginUserDto } from './dto/loginUserDto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Post('login')
  loginUser(@Body() userData: LoginUserDto, @Res({ passthrough: true }) res) {
    return this.userService.loginUser(userData, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req): any {
    return this.userService.profile(req);
  }

  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    return this.userService.refresh(refreshToken);
  }
}
