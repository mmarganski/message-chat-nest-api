import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Message } from './index'

@Entity()
export class User {

    @PrimaryColumn()
    socketId: string

    @Column()
    userName: string

    @Column()
    avatar: string

    @Column()
    isActive: boolean

    @OneToMany(() => Message, message => message.socketId)
    messages: Array<Message>
}
