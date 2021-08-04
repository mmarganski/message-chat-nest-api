import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User, Room } from './index'

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    messageId: number

    @Column()
    messageContent: string

    @Column()
    isImage: boolean

    @Column()
    date: Date

    @ManyToOne(() => User, user => user.messages)
    socketId: string

    @ManyToOne(() => Room, room => room.messages)
    roomName: string
}
