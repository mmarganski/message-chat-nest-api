import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { MessageEntity } from './message.entity'

@Entity({ name: 'room' })
export class RoomEntity {
    @PrimaryColumn()
    roomName: string

    @Column()
    isPrivate: boolean

    @OneToMany(() => MessageEntity, message => message.room)
    messages: Array<MessageEntity>

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
