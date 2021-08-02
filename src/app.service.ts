import { Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AppService {
  getHello(request: Request): string {
    console.log(`${request.body}`)
    return `${request.body}`
  }
}
