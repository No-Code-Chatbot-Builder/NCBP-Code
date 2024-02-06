import { Module } from '@nestjs/common';
import { AppController } from './dataset.controller';
import { AppService } from './dataset.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
