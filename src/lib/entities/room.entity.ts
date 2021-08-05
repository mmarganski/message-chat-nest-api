import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { MessageEntity } from './message.entity'

@Entity({ name: 'room' })
export class RoomEntity {
    @PrimaryColumn()
    roomName: string

    @Column()
    isPrivate: boolean

    @OneToMany(() => MessageEntity, message => message.room)
    messages: Array<MessageEntity>
}
