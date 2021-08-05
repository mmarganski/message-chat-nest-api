import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'userRoom' })
@Unique(['socketId', 'roomName'])
export class UserRoomEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socketId: string

    @Column()
    roomName: string

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date
}
