import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { createQueryBuilder, Repository } from 'typeorm'
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

    getMessagesByRoomName(roomName: string) {
        return this.roomRepository.find({ select: ['messages'], where: { roomName } })
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

    async createMessage (messageContent: string, isImage: boolean, date: Date, userId: string, roomName: string) {
        const currentRoom = await this.roomRepository.findOne({where: { roomName } })

        return this.messageRepository.save({
            messageContent,
            isImage,
            date,
            socketId: userId,
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
        if (userRoom === undefined) {
            this.createUserRoom(socketId, roomName)
        }
    }

    deactivateUser (socketId: string) {
        return this.userRepository.update({ socketId },{ isActive: false })
    }

    async getUsersInRoom (roomName: string) {
        return createQueryBuilder('UserEntity')
            .leftJoinAndSelect(UserRoomEntity, 'UserRoomEntity', 'UserEntity.socketId = UserRoomEntity.socketId')
            .select('UserEntity.socketId')
            .where('UserRoomEntity.roomName = :roomName', { roomName })
            .getMany()
    }
}
