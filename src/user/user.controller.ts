import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('current')
  getCurrent() {
    return 'current user test';
  }
}
