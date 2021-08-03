import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { createConnection } from 'typeorm'

@Injectable()
export class AppService {
    getHello(request: Request): string {
        return `Hello! \n World${JSON.stringify(request.body)}`
    }
}

export const testDBConnection = () => {
    // console.log("connection test:")
    createConnection({
        type: "mysql",
        host: "localhost",
        port: 3307,
        username: "test",
        password: "test",
        database: "testdb",
        entities: [
        ],
        synchronize: true,
        logging: false
    }).then(connection => {
        // console.log("DB connected")
    }).catch(error => console.log(error))
}