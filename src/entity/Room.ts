import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { User, Message } from './index'

@Entity()
export class Room {

    @PrimaryColumn()
    roomName: string

    @Column()
    isPrivate: boolean

    @OneToMany(() => Message, message => message.roomName)
    messages: Array<Message>

    @ManyToMany(() => User)
    @JoinTable()
    users: Array<User>
}
