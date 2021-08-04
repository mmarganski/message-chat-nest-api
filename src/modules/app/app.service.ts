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

    async getUsersList() {
        return this.userRepository.find({ select: ['socketId', 'userName', 'avatar', 'isActive'] })
    }

    async getRoomNames() {
        return this.roomRepository.find({ select: ['roomName'] })
    }

    async getPublicRooms() {
        return this.roomRepository.find({ select: ['roomName'], where: { isPrivate: false } })
    }

    async getUsersByRoomName (roomName: string) {
        return this.roomRepository.find({ where: { roomName } })
    }

    async getMessagesByRoomName(roomName: string) {
        return this.messageRepository.find({
            select: ['messageContent', 'isImage', 'date', 'socketId'],
            where: { roomName }
        })
    }

    async getUserBySocketId(socketId: string) {
        return this.userRepository.findOne({ where: { socketId } })

    }

    async getRoomByName(roomName: string) {
        return this.roomRepository.findOne({ where: { roomName } })

    }

    async createUser(socketId: string, userName: string, avatar: string) {
        return this.userRepository.save({
            socketId,
            userName,
            avatar,
            isActive: true
        })
    }

    async createRoom (roomName: string, isPrivate: boolean) {
        return this.roomRepository.save({
            roomName,
            isPrivate
        })
    }

    async createMessage (messageContent: string, isImage: boolean, date: Date, userId: string, roomName: string) {
        return this.messageRepository.save({
            messageContent,
            isImage,
            date,
            socketId: userId,
            roomName
        })
    }

    async deactivateUser (socketId: string) {
        return this.userRepository.update({ socketId },{ isActive: false })
    }
}
