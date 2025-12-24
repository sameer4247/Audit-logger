import { createHashKey, generateRawKey } from '../../common/utils/keygen';
import {prisma} from '../../db/prisma'
import { User } from '../../prisma/generated/primsa/client';
import { UserRepository } from './user.repository';


export class UserService {
  constructor(private userRepository: UserRepository) {}
  
   async getUserList(limit: number, cursor: string | undefined){
        return this.userRepository.findMany(limit, cursor)
    }
  
    async getUserById(id: string){
      return this.userRepository.findOne(id);
    }
  
    async createUser(data: User){
    //generate credentials for user
      const randomKey = generateRawKey();
      const credentials = createHashKey(randomKey);
      return {...await this.userRepository.create({...data, credentials}), 'x-api-key':randomKey};
    }
  
    async updateUser(id: string, data: User){
      return this.userRepository.update(id, data);
    }
  
    async deleteUser(id: string){
      return this.userRepository.delete(id);
    }
 
}