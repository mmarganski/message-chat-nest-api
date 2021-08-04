import { NestFactory } from '@nestjs/core'
import { AppModule } from 'modules/app'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.enableCors()
    await app.listen(3002)
}

bootstrap()
