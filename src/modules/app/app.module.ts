import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { AppGateway } from './app.gateway'
import { Connection, getConnectionOptions } from 'typeorm'
import { MessageEntity, RoomEntity, UserEntity } from '../../lib/entities'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
                Object.assign(await getConnectionOptions(), {
                    autoLoadEntities: true,
                })
        }),
        TypeOrmModule.forFeature([UserEntity, RoomEntity, MessageEntity])],
    controllers: [],
    providers: [AppService, AppGateway]
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
