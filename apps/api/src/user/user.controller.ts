import { Body, Controller, Get, Patch, UseGuards, Param } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

interface User {
  id: number;
  username: string | null;
  email: string;
  hash: string;
  createdAt: Date;
  updateAt: Date;
}

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
