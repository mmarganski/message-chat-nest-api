import { Controller, Get, Req, Post } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'

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
