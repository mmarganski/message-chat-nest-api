import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppService } from './app.service'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(3002)
}

const init = async () => {
    const as = new AppService()
}

bootstrap()
init()
