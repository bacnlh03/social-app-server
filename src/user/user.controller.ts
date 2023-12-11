import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
}
