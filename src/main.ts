import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(3002)
}

bootstrap()
