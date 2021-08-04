import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { UserEntity, RoomEntity, MessageEntity } from 'lib/entities'

@Injectable()
export class AppService {
    constructor(
        private readonly connection: Connection,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}
}
