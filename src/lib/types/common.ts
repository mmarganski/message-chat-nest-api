export type Message = {
    userName: string,
    userId: string,
    avatar: string,
    message: string,
    image: string,
    date: number
}

export type MessageCall = {
    messageContent: string,
    image: string,
    roomid: string,
    isPrivate: boolean
}

export enum Rooms {
    All = 'All'
}

export type CreateChatMessage = {
    messageText: string,
    image: string,
    socketId: string,
    roomName: string
}

export type MessageQueryResult = {
    avatar: string,
    date: string,
    image: string,
    messageText: string,
    socketId: string,
    userName: string
}
