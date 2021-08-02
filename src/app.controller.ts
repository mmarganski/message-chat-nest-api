import { Controller, Get, Req} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express'
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request): string {
    return this.appService.getHello(request);
  }
  @SubscribeMessage('test')
  handleEvent(@MessageBody() data: string): string {
    console.log(data)
    return data;
  }
}
