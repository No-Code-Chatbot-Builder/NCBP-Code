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

  @Get('/userById')
  async getUserById(@Body() body: { PK: string, SK: string }): Promise<any> {
    const { PK, SK } = body;
    return await this.userService.getUserById(PK, SK);
  }

  @Post('/UpdateSpecificUser')
  async updateUserField(@Body() body: { PK: string, SK: string, [key: string]: any }): Promise<any> {
    const { PK, SK, ...fieldsToUpdate } = body;
    return await this.userService.updateUserFields(PK, SK, fieldsToUpdate);
  }
}

