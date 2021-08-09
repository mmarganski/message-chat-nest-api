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

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: string
}
