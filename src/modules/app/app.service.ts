import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateChatMessage, Message } from 'lib/types/common'
import { UserEntity, RoomEntity, MessageEntity, UserRoomEntity } from 'lib/entities'

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
        @InjectRepository(UserRoomEntity)
        private readonly userRoomRepository: Repository<UserRoomEntity>,
    ) {}

    getUsersList() {
        return this.userRepository.find({ select: ['socketId', 'userName', 'avatar', 'isActive'] })
    }

    getActiveUsers() {
        return this.userRepository.find({
            select: ['socketId'],
            where: { isActive: true }
        })
    }

    getRoomNames() {
        return this.roomRepository.find({ select: ['roomName'] })
    }

    getPublicRooms() {
        return this.roomRepository.find({ select: ['roomName'], where: { isPrivate: false } })
    }

    getMessagesByRoomName2(roomName: string) {
        return this.messageRepository.find({  where: { room: roomName } })
    }

    getMessagesByRoomName(roomName: string) {
        return this.userRepository
            .createQueryBuilder('U')
            .leftJoinAndSelect(MessageEntity, 'M', 'U.socketId = M.socketId')
            .select(['U.userName', 'U.socketId', 'U.avatar', 'M.messageText', 'M.image', 'M.date'])
            .where('UR.roomName = :roomName', { roomName })
            .getMany()
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
            isPrivate,
            messages: []
        })
    }

    async createMessage (message: CreateChatMessage) {
        const currentRoom = await this.roomRepository
            .findOne({ where: { roomName: message.roomName } })

        const [messageText, image] = message.isImage
            ? ['', message.messageContent]
            : [message.messageContent, '']

        return this.messageRepository.save({
            messageText,
            image,
            date: new Date(),
            socketId: message.socketId,
            room: currentRoom
        })
    }

    createUserRoom (socketId: string, roomName: string) {
        return this.userRoomRepository.save({
            roomName,
            socketId,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async addUserToRoom (roomName: string, socketId: string) {
        const userRoom = await this.userRoomRepository.findOne({ where: { roomName, socketId } })

        if (!userRoom) {
            await this.createUserRoom(socketId, roomName)
        }
    }

    deactivateUser (socketId: string) {
        return this.userRepository.update({ socketId },{ isActive: false })
    }

    async getUsersInRoom (roomName: string) {
        return this.userRepository
            .createQueryBuilder('U')
            .leftJoinAndSelect(UserRoomEntity, 'UR', 'U.socketId = UR.socketId')
            .select('U.socketId')
            .where('UR.roomName = :roomName', { roomName })
            .getMany()
    }

    async formatMessage(message: MessageEntity) {
        const user = await this.getUserBySocketId(message.socketId)
        const newMessage: Message = {
            userName: user.userName,
            userId: message.socketId,
            avatar: user.avatar.toString(),
            message: message.messageText,
            image: message.image,
            date: message.date.getTime()

        }

        return newMessage
    }
}
