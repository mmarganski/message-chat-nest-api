import { Controller, Get, Req, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { Request } from 'express'
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(@Req() request: Request): string {
        return this.appService.getHello(request)
    }
    @Post()
    getHelloAndBody(@Req() request: Request): string {
        return this.appService.getHello(request)
    }
}
