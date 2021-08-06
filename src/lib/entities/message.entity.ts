import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RoomEntity } from './room.entity'

@Entity({ name: 'message' })
export class MessageEntity {
    @PrimaryGeneratedColumn()
    messageId: number

    @Column()
    messageText: string

    @Column()
    image: string

    @Column()
    date: Date

    @Column()
    socketId: string

    @ManyToOne(() => RoomEntity, room => room.messages)
    room: RoomEntity
}
