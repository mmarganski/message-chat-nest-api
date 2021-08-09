import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { RoomEntity } from './room.entity'

@Entity({ name: 'message' })
export class MessageEntity {
    @PrimaryGeneratedColumn()
    messageId: number

    @Column({type: 'text'})
    messageText: string

    @Column()
    image: string

    @Column()
    socketId: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => RoomEntity, room => room.messages)
    room: RoomEntity
}
