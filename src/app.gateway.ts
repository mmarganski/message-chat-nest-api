import {
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Message, MessageCall, Rooms } from './types'

@WebSocketGateway()
export class AppGateway implements OnGatewayDisconnect{

    @WebSocketServer() server: Server
    users: Map<string, Array<string>> = new Map() // socket.id => [userName, avatar]
    rooms: Map<string, Array<string>> = new Map([[Rooms.All, []]]) // roomName => [... userIds]
    privateRooms: Set<string> = new Set()
    messages: Map<string, Array<string | Message>> = new Map([[Rooms.All, []]]) //  roomname => [...Message]
    activeUsers: Set<string> = new Set()

    @SubscribeMessage('getUsersList')
    getUserList(client: Socket) {
        client.emit('sendUsersList', [...this.users.entries()])
        client.emit('activeUsers', [...this.activeUsers.keys()])
    }

    @SubscribeMessage('getRoomList')
    getRoomList(): WsResponse {
        const roomList = [...this.rooms.keys()].filter(roomName => !this.privateRooms.has(roomName))

        return { event: 'sendRoomList', data: roomList }
    }

    @SubscribeMessage('newUser')
    newUser(client: Socket, [userName, avatar]: Array<string>) {
        const allUsers = [...this.rooms.get(Rooms.All), userName]

        this.users.set(client.id, [userName, avatar])
        this.rooms.set(Rooms.All, allUsers)
        this.activeUsers.add(client.id)
        client.broadcast.emit('confirmNewUser', ([userName, client.id, avatar, false]))
        client.emit('confirmNewUser', ([userName, client.id, avatar, true]))
    }

    @SubscribeMessage('newRoom')
    newRoom(client: Socket, roomName: string): WsResponse {
        if (this.rooms.has(roomName)) {
            return null
        }

        const [currentUserName] = this.users.get(client.id)

        this.rooms.set(roomName, [currentUserName])
        this.messages.set(roomName, [])

        return { event: 'confirmNewRoom', data: roomName }
    }

    @SubscribeMessage('joinRoom')
    joinRoom(client: Socket, room: string): WsResponse {
        const isRoomMember: boolean = [...this.rooms.get(room)].includes(client.id)

        if (!isRoomMember) {
            client.join(room)
            this.rooms.set(room, [...this.rooms.get(room), client.id])
        }

        return { event: 'messageHistory', data: this.messages.get(room) }
    }

    @SubscribeMessage('joinPrivateRoom')
    joinPrivateRoom(client: Socket, userId: string): WsResponse {
        const roomName = this.getPrivateRoomName(userId, client.id)

        if (!this.rooms.has(roomName)) {
            this.privateRooms.add(roomName)
            this.rooms.set(roomName, [client.id, userId])
            this.messages.set(roomName, [])
        }

        return { event: 'messageHistory', data: this.messages.get(roomName) }
    }

    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, messageCall: MessageCall) {
        const roomid = messageCall.isPrivate
            ? this.getPrivateRoomName(messageCall.roomid, client.id)
            : messageCall.roomid

        const newMessage: Message = this.prepareMessage(messageCall, client.id)
        this.messages.set(roomid, [...this.messages.get(roomid), newMessage])

        if (messageCall.isPrivate) {
            client.emit('updateMessage', [newMessage, this.getOtherPrivateRoomUser(roomid, client.id)])

            return this.server.to(this.getOtherPrivateRoomUser(roomid, client.id)).emit('updateMessage', [newMessage, client.id])
        }

        this.server.to(roomid).emit('updateMessage', [newMessage, roomid])
    }

    handleDisconnect(client: Socket) {
        this.activeUsers.delete(client.id)
        client.broadcast.emit('activeUsers', [...this.activeUsers.keys()])
    }

    prepareMessage = (messageCall: MessageCall, clientid: string) => {
        const [currentUserName, userAvatar] = this.users.get(clientid)
        const time = new Date().getTime()
        const newMessage: Message = {
            userName: currentUserName,
            userId: clientid,
            avatar: userAvatar,
            message: messageCall.messageContent,
            image: messageCall.image,
            date: time
        }

        return newMessage
    }

    getPrivateRoomName = (userId: string, clientid: string) =>
        `${userId}` < `${clientid}`
            ? `${userId} & ${clientid}`
            : `${clientid} & ${userId}`

    getOtherPrivateRoomUser = (roomName: string, clientid: string) => {
        const userId: string = roomName.replace(`${clientid}`, '')
            .replace(' & ', '')

        return userId
    }
}
