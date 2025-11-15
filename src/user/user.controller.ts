import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { LoginUserDto } from './dto/loginUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Post('login')
  loginUser(@Body() userData: LoginUserDto) {
    return this.userService.loginUser(userData);
  }

  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    return this.userService.refresh(refreshToken);
  }
}
