import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entity/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    console.log('register')
    console.log(registerUserDto)
    return this.authService.register(registerUserDto)
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginUserDto: LoginUserDto) {
    console.log('login')
    console.log(loginUserDto)
    return this.authService.login(loginUserDto)
  }

  @Post('refresh-token')
  refreshToken(@Body() {refreshToken}) {
    console.log('refresh token')
    return this.authService.refreshToken(refreshToken)
  }
}
