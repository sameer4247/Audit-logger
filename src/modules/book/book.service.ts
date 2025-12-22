import {prisma} from '../../db/prisma'
import { CreateBookDto, UpdateBookDto } from './book.dto';

export class BookService {
  constructor() {}

  async findById(id: string){
      return prisma.book.findUniqueOrThrow({
          where: { id }
      })
  }
  async create(data: CreateBookDto) {
    return prisma.book.create({
      data: {
        ...data,
        //createdBy: userId,
      },
    });
  }

  async update(id: string, data: UpdateBookDto, userId?: string) {
    // 1. Fetch current state for diffing
    const existingBook = await prisma.book.findUniqueOrThrow({ where: { id } });
    // 2. Perform Update
    return prisma.book.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }

  async delete(id: string) {
    const existingBook = await prisma.book.findUniqueOrThrow({ where: { id } });
    await prisma.book.delete({ where: { id } });
  }
}