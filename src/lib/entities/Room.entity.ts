import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { MessageEntity } from './'

@Entity({name: 'Room'})
export class RoomEntity {

    @PrimaryColumn()
    roomName: string

    @Column()
    isPrivate: boolean

    @OneToMany(() => MessageEntity, message => message.roomName)
    messages: Array<MessageEntity>
}
