import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateChatMessage, Message } from 'lib/types'
import { UserEntity, RoomEntity, MessageEntity, UserRoomEntity } from 'lib/entities'
import { MessageQueryResult } from './dao'

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
        return this.userRepository.find({
            select: [
                'socketId',
                'userName',
                'avatar',
                'isActive'
            ]
        })
    }

    getActiveUsers() {
        return this.userRepository.find({
            select: ['socketId'],
            where: {
                isActive: true
            }
        })
    }

    getRoomNames() {
        return this.roomRepository
            .find({
                select: ['roomName']
            })
    }

    getPublicRooms() {
        return this.roomRepository.find({
            select: ['roomName'],
            where: {
                isPrivate: false
            }
        })
    }

    getMessagesByRoomName(roomName: string) {
        return this.userRepository
            .createQueryBuilder('U')
            .innerJoin(MessageEntity, 'M', 'U.socketId = M.socketId')
            .select('U.userName, U.socketId, U.avatar, M.messageText, M.image, M.date')
            .where('M.roomRoomName = :roomName', { roomName })
            .getRawMany<MessageQueryResult>()
    }

    getUserBySocketId(socketId: string) {
        return this.userRepository.findOne({
            where: {
                socketId
            }
        })
    }

    getRoomByName(roomName: string) {
        return this.roomRepository.findOne({
            where: {
                roomName
            }
        })
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
            .findOne({
                where: {
                    roomName: message.roomName
                }
            })

        return this.messageRepository.save({
            messageText: message.messageText,
            image: message.image,
            socketId: message.socketId,
            room: currentRoom
        })
    }

    async addUserToRoom (roomName: string, socketId: string) {
        const userRoom = await this.userRoomRepository.findOne({
            where: {
                roomName,
                socketId
            }
        })

        if (!userRoom) {
            await this.createUserRoom(socketId, roomName)
        }
    }

    deactivateUser (socketId: string) {
        return this.userRepository
            .update({
                socketId
            },{
                isActive: false
            })
    }

    async formatMessage(message: MessageEntity) {
        const user = await this.getUserBySocketId(message.socketId)
        const newMessage: Message = {
            userName: user.userName,
            userId: message.socketId,
            avatar: user.avatar.toString(),
            message: message.messageText,
            image: message.image,
            date: `${message.date}`
        }

        return newMessage
    }

    private async createUserRoom (socketId: string, roomName: string) {
        return this.userRoomRepository.save({
            roomName,
            socketId
        })
    }
}
