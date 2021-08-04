import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RoomEntity } from './room.entity'

@Entity({ name: 'message' })
export class MessageEntity {
    @PrimaryGeneratedColumn()
    messageId: number

    @Column()
    messageContent: string

    @Column()
    isImage: boolean

    @Column()
    date: Date

    @Column()
    socketId: string

    @ManyToOne(() => RoomEntity, room => room.messages)
    roomName: string
}