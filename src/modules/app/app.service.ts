import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { UserEntity, RoomEntity, MessageEntity } from 'lib/entities'

@Injectable()
export class AppService{
    constructor(
        private readonly connection: Connection,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {
        this.createMessage('lorem ipsum dolor set amet', false, new Date(), 'Tom', 'room#2')
    }

    async getUsersList() {
        return this.userRepository.find({ select: ['socketId', 'userName', 'avatar', 'isActive'] })
    }

    async getRoomNames() {
        return this.roomRepository.find({ select: ['roomName'] })
    }

    async getPublicRooms() {
        return this.roomRepository.find({select: ['roomName'], where: {isPrivate: false}})
    }

    async getUsersByRoomName (roomName: string) {
        const roomRepository = this.roomRepository

        return roomRepository.find({ where: { roomName } })
    }

    async getMessagesByRoomName(roomName: string) {
        return this.messageRepository.find({
            select: ['messageContent', 'isImage', 'date', 'socketId'],
            where: {roomName}
        })
    }

    async getUserBySocketId(socketId: string) {
        const userRepository = this.userRepository
        const [user] = await userRepository.find({where: { socketId}})

        return user
    }

    async getRoomByName(roomName: string) {
        const roomRepository = this.roomRepository
        const [room] = await roomRepository.find({where: {roomName}})

        return room
    }

    async createUser(socketId: string, userName: string, avatar: string) {
        const userRepository = this.userRepository
        const user = userRepository.create({
            socketId,
            userName,
            avatar,
            isActive: true
        })

        return userRepository.save(user)
    }

    async createRoom (roomName: string, isPrivate: boolean) {
        const roomRepository = this.roomRepository
        const room = roomRepository.create({
            roomName,
            isPrivate
        })

        return roomRepository.save(room)
    }

    async createMessage (messageContent: string, isImage: boolean, date: Date, userId: string, roomName: string) {
        const messageRepository = this.messageRepository
        const message = messageRepository.create({
            messageContent,
            isImage,
            date,
            socketId: userId,
            roomName
        })

        return messageRepository.save(message)
    }

    async deactivateUser (socketId: string) {
        const userRepository = this.userRepository
        const [user] = await userRepository.find({where: { socketId}})

        user.isActive = false

        return userRepository.save(user)
    }

    async joinRoom (socketId: string, roomName: string) {
        const userRepository = this.userRepository
        const roomRepository = this.roomRepository
        const [user] = await userRepository.find({where: {socketId}})
        const [room] = await roomRepository.find({where: {roomName}})

        // room.users = [...room.users, user]

        return roomRepository.save(room)
    }
}
