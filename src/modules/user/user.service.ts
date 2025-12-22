import { createHashKey, generateRawKey } from '../../common/utils/keygen';
import {prisma} from '../../db/prisma'
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';


export class UserService {
  constructor() {}
  excludeUserData = [
    "id",
    "credentials"
  ]
  async findById(id: string){
      return this.removeUserKeys(prisma.user.findUniqueOrThrow({
          where: { id }
      }));
  }

  async create(data: any) {

    //generate credentials for user
    const randomKey = generateRawKey();
    const credentials = createHashKey(randomKey);
    return this.removeUserKeys({... await prisma.user.create({
      data: {
        ...data,
        credentials
        //createdBy: userId,
      } as any,
    }), api_key : randomKey});
  }

  async update(id: string, data: UpdateUserDto, userId?: string) {
    // 1. Fetch current state for diffing
    const existingUser = await prisma.user.findUniqueOrThrow({ where: { id } });
    // 2. Perform Update
    return this.removeUserKeys(await prisma.user.update({
      where: { id },
      data: {
        ...data
      } as any,
    }));
  }

  async delete(id: string) {
    const existingUser = await prisma.user.findUniqueOrThrow({ where: { id } });
    return this.removeUserKeys(await prisma.user.delete({ where: { id } }));
  }

  removeUserKeys(data: any){
        for(let key of this.excludeUserData){
            delete data[key];
        }
        return data;
  }
}