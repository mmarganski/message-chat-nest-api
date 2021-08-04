import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({name: 'User'})
export class UserEntity {

    @PrimaryColumn()
    socketId: string

    @Column()
    userName: string

    @Column()
    avatar: string

    @Column()
    isActive: boolean
}
