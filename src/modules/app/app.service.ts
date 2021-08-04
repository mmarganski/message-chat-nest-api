import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserEntity, RoomEntity, MessageEntity } from 'lib/entities'

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}

    getUsersList() {
        return this.userRepository.find({ select: ['socketId', 'userName', 'avatar', 'isActive'] })
    }

    getRoomNames() {
        return this.roomRepository.find({ select: ['roomName'] })
    }

    getPublicRooms() {
        return this.roomRepository.find({ select: ['roomName'], where: { isPrivate: false } })
    }

    getUsersByRoomName (roomName: string) {
        return this.roomRepository.find({ where: { roomName } })
    }

    getMessagesByRoomName(roomName: string) {
        return this.messageRepository.find({
            select: ['messageContent', 'isImage', 'date', 'socketId'],
            where: { roomName }
        })
    }

    getUserBySocketId(socketId: string) {
        return this.userRepository.findOne({ where: { socketId } })

    }

    getRoomByName(roomName: string) {
        return this.roomRepository.findOne({ where: { roomName } })
    }

    createUser(socketId: string, userName: string, avatar: string) {
        return this.userRepository.save({
            socketId,
            userName,
            avatar,
            isActive: true
        })
    }

    createRoom (roomName: string, isPrivate: boolean) {
        return this.roomRepository.save({
            roomName,
            isPrivate
        })
    }

    createMessage (messageContent: string, isImage: boolean, date: Date, userId: string, roomName: string) {
        return this.messageRepository.save({
            messageContent,
            isImage,
            date,
            socketId: userId,
            roomName
        })
    }

    deactivateUser (socketId: string) {
        return this.userRepository.update({ socketId },{ isActive: false })
    }
}
