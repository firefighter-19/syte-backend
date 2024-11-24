import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/create')
  createUser(@Body() { user }: { user: string }) {
    return this.userService.createUser(user);
  }

  @Get('/')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
