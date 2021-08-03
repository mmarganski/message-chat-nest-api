import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Message } from './Message'

@Entity()
export class User {

  @PrimaryColumn()
  userId: string

  @Column()
  userName: string

  @Column()
  avatar: string

  @Column()
  isActive: boolean

  @OneToMany(() => Message, message => message.userId)
  messages: Message[]
}