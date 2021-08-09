import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RoomEntity } from './room.entity'

@Entity({ name: 'message' })
export class MessageEntity {
    @PrimaryGeneratedColumn()
    messageId: number

    @Column({type: 'text'})
    messageText: string

    @Column()
    image: string

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
    date: string

    @Column()
    socketId: string

    @ManyToOne(() => RoomEntity, room => room.messages)
    room: RoomEntity
}
