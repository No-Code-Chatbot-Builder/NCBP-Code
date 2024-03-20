// app.controller.ts
import { Controller, Get, Put, Body, Req, Res, HttpStatus} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import {AuthMiddleware} from './auth/auth.service' // Import your middleware

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly dynamoDbService: UserService, private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/user/health')
  getHealth(): string {
    return "User Service is working";
  }

  @Get('/users')
  async getUserById(@Req() req: Request): Promise<any> {
   const id = req['user'].id;
   const email = req['user'].email;
    return await this.userService.getUserById(id, email);
  }

  @Put('/users')
  async updateUserField(@Body() body: { [key: string]: any }, @Req() req: Request): Promise<any> {
    const { ...fieldsToUpdate } = body;
     const id = req['user'].id;
     const email = req['user'].email;
    return await this.userService.updateUserFields(id, email, fieldsToUpdate);
  }
}

