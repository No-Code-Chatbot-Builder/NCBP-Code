// app.controller.ts
import { Controller, Get, Post, Body, Req, Res, HttpStatus} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Middleware } from './middleware/auth.middleware'; // Import your middleware

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly dynamoDbService: UserService, private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  async getAllUsers(): Promise<any[]> {
    return await this.dynamoDbService.getAllUsers();
  }

  @Post('/userById')
  async getUserById(@Body() body: { sub: string }): Promise<any> {
    const { sub } = body;
    return await this.userService.getUserById(sub);
  }

  @Post('/specificUser')
  async updateUserField(@Body() body: { sub: string, [key: string]: any }): Promise<any> {
    const { sub, ...fieldsToUpdate } = body;
    return await this.userService.updateUserFields(sub, fieldsToUpdate);
  }
}

