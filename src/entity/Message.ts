import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Room } from './Room'

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  messageId: number

  @Column()
  messageContent: string

  @Column()
  isImage: boolean

  @Column()
  date: Date

  @ManyToOne(() => User, user => user.messages)
  userId: string

  @ManyToOne(() => Room, room => room.messages)
  roomName: string

}