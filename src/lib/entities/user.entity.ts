import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryColumn()
    socketId: string

    @Column()
    userName: string

    @Column('longblob')
    avatar: string

    @Column()
    isActive: boolean
}
