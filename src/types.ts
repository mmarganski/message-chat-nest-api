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
