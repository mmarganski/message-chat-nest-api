import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { createConnection, getRepository } from 'typeorm'
import { User } from './entity/User'

@Injectable()
export class AppService {
    getHello(request: Request): string {
        return `Hello! \n World${JSON.stringify(request.body)}`
    }
}

export const testDBConnection = async () => {
    console.log("connection test:")
    await createConnection()
    console.log("DB connected")

}

export const test = async () => {
  const connection  = await createConnection()
  const user = new User()

  user.userName = 'Hank'
  user.userId = '12'
  user.avatar = 'foo'
  user.isActive = true
  user.messages = []

  await connection.manager.save(user)
  const users = await connection.manager.find(User)

  const userRepository = getRepository(User)
  const user2 = userRepository.create({ userId: '10', userName: 'Bob', avatar: 'bar', isActive: false, messages: [] })
  await userRepository.save(user2)

}