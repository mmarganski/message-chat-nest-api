import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { MessageEntity, RoomEntity, UserEntity, UserRoomEntity } from 'lib/entities'
import { AppService } from './app.service'
import { AppGateway } from './app.gateway'
import { AppController } from './app.controller'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
                Object.assign(await getConnectionOptions(), {
                    autoLoadEntities: true,
                })
        }),
        TypeOrmModule.forFeature([UserEntity, RoomEntity, MessageEntity, UserRoomEntity]),],
    controllers: [AppController],
    providers: [AppService, AppGateway]
})
export class AppModule {}
