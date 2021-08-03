import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { User } from './User'
import { Message } from './Message'

@Entity()
export class Room {

  @PrimaryColumn()
  roomName: string

  @Column()
  isPrivate: boolean

  @OneToMany(() => Message, message => message.roomName)
  messages: Message[]

  @ManyToMany(() => User)
  @JoinTable()
  categories: User[]
}
