import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.service';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, UserService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude({ path: 'users/health', method: RequestMethod.ALL },
    ).forRoutes('*'); // or specify more specific routes or controllers
  }
  }