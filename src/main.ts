import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import "reflect-metadata"
import { testDBConnection, test } from './app.service'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(3002)
}

bootstrap()
test()