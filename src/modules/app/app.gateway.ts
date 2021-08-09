import {
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Message, MessageCall, MessageQueryResult } from 'lib/types/common'
import { AppService } from './app.service'

import * as fs from 'fs'

type CreateChatMessage = {
    messageText: string,
    image: string,
    socketId: string,
    roomName: string
}

@WebSocketGateway()
export class AppGateway implements OnGatewayDisconnect {
    @WebSocketServer() server: Server

    constructor(private readonly appsService: AppService) {}

    @SubscribeMessage('getUsersList')
    async getUserList(client: Socket) {
        const users = await this.appsService.getUsersList()
        const userNames = users
            .map(({ socketId, userName, avatar }) =>
                [socketId, [ userName, avatar.toString()]])
        const activeUsers = await this.appsService.getActiveUsers()
        const activeUserNames = activeUsers.map(({ socketId }) => socketId)

        client.emit('sendUsersList', userNames)
        client.emit('activeUsers', activeUserNames)
    }

    @SubscribeMessage('getRoomList')
    async getRoomList(): Promise<WsResponse> {
        const rooms = await this.appsService.getPublicRooms()
        const roomNames = rooms.map(({ roomName }) => roomName)

        return { event: 'sendRoomList', data: roomNames }
    }

    @SubscribeMessage('newUser')
    async newUser(client: Socket, [userName, avatar]: Array<string>) {
        const user = await this.saveUser(client.id, avatar, userName)

        client.broadcast.emit('confirmNewUser', ([user.userName, user.socketId, user.avatar, false]))
        client.emit('confirmNewUser', ([user.userName, user.socketId, user.avatar, true]))
    }

    @SubscribeMessage('newRoom')
    async newRoom(client: Socket, roomName: string): Promise<WsResponse> {
        const rooms = await this.appsService.getRoomNames()
        const roomNames = rooms.map(({ roomName }) => roomName)

        if(roomNames.includes(roomName)){
            return null
        }

        await this.appsService.createRoom(roomName, false)
        await this.appsService.addUserToRoom(roomName, client.id)

        this.server.emit('confirmNewRoom', roomName)
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(client: Socket, roomName: string): Promise<WsResponse> {
        await this.appsService.addUserToRoom(roomName, client.id)
        client.join(roomName)

        const messageHistory = await  this.appsService.getMessagesByRoomName(roomName)
        const formattedHistory = messageHistory
            .map(({
                messageText,
                socketId,
                ... others
            }: MessageQueryResult) => {
                const ret = {
                    message: messageText,
                    userId: socketId,
                    ...others
                }

                return ret
            })

        return { event: 'messageHistory', data: formattedHistory }
    }

    @SubscribeMessage('joinPrivateRoom')
    async joinPrivateRoom(client: Socket, userId: string): Promise<WsResponse> {
        const roomName = this.getPrivateRoomName(userId, client.id)
        const room = await this.appsService.getRoomByName(roomName)

        if (!room) {
            await this.appsService.createRoom(roomName, true)
            await this.appsService.addUserToRoom(roomName, client.id)
            await this.appsService.addUserToRoom(roomName, userId)
        }
        const messageHistory = await this.appsService.getMessagesByRoomName(roomName)
        const formattedHistory = messageHistory
            .map(({
                messageText,
                socketId,
                ... others
            }: MessageQueryResult) => {
                const ret = {
                    message: messageText,
                    userId: socketId,
                    ...others
                }

                return ret
            })

        return { event: 'messageHistory', data: formattedHistory }
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(client: Socket, messageCall: MessageCall) {
        const imagePath = messageCall.image === ''
            ? ''
            : this.saveImage(messageCall.image, client.id)
                .replace(`${ process.env.IMAGES_PATH }`, 'http://localhost:3002/images')

        const roomId = messageCall.isPrivate
            ? this.getPrivateRoomName(messageCall.roomid, client.id)
            : messageCall.roomid

        const message: CreateChatMessage = {
            messageText: messageCall.messageContent,
            image: imagePath,
            socketId: client.id,
            roomName: roomId
        }
        const ret = await this.appsService.createMessage(message)
        const newMessage: Message = await this.appsService.formatMessage(ret)

        if (messageCall.isPrivate) {
            client.emit('updateMessage', [newMessage, this.getOtherPrivateRoomUser(roomId, client.id)])

            return this.server.to(this.getOtherPrivateRoomUser(roomId, client.id)).emit('updateMessage', [newMessage, client.id])
        }

        this.server.to(roomId).emit('updateMessage', [newMessage, roomId])
    }

    imageFromBase(image: string) {
        const [metaData, content] = image.split(',')
        const buff = Buffer.from(content, 'base64')
        const fileType = metaData
            .replace(/.*\//, '')
            .replace(/;.*/, '')

        return [buff, fileType]
    }

    saveImage(image: string, clientId: string): string{
        const [content, fileType] = this.imageFromBase(image)
        const imagePath = `${ process.env.IMAGES_PATH }\\${ clientId }-${ Math.random()
            .toString(36)
            .substr(2, 16) }.${ fileType }`
            .trim()

        fs.writeFile(`${ imagePath }`, content, () => {})

        return imagePath
    }

    async handleDisconnect(client: Socket) {
        await this.appsService.deactivateUser(client.id)

        const activeUsers = await this.appsService.getActiveUsers()

        client.broadcast.emit('activeUsers', activeUsers)
    }

    async saveUser(socketId: string, avatar: string, userName: string){
        if(avatar.includes('http://localhost')) {
            const newAvatarPath = 'http://localhost:3002/images/avatar.png'

            return this.appsService.createUser(socketId, userName, newAvatarPath)
        }

        const [content, fileType] = this.imageFromBase(avatar)
        const avatarPath = `${ process.env.IMAGES_PATH }\\${ socketId }.${ fileType }`
        const avatarLocalPath = `${ process.env.IMAGES_LOCAL_PATH }\\${ socketId }.${ fileType }`

        fs.writeFile(avatarPath, content, () => {})

        return this.appsService.createUser(socketId, userName, avatarLocalPath)
    }

    getPrivateRoomName(userId: string, clientId: string) {
        return userId < clientId
            ? `${ userId } & ${ clientId }`
            : `${ clientId } & ${ userId }`
    }

    getOtherPrivateRoomUser(roomName: string, clientId: string) {
        const userId: string = roomName
            .replace(`${ clientId }`, '')
            .replace(' & ', '')

        return userId
    }
}
