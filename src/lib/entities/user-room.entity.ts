import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'userRoom' })
@Unique(['socketId', 'roomName'])
export class UserRoomEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socketId: string

    @Column()
    roomName: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
