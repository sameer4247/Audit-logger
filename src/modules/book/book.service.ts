import { Book } from '../../prisma/generated/primsa/client';
import { BookRepository } from './book.repository';

export class BookService {
  constructor(private bookRepository: BookRepository) {}
  getBookList(limit: number, cursor: string | undefined){
      return this.bookRepository.findMany(limit, cursor)
  }

  getBookById(id: string){
    return this.bookRepository.findOne(id);
  }

  createBook(data: Book){
    return this.bookRepository.create(data);
  }

   createBookMany(data: Book[]){
    return this.bookRepository.createMany(data);
  }

  updateBook(id: string, data: Book){
    return this.bookRepository.update(id, data);
  }

  deleteBook(id: string){
    return this.bookRepository.delete(id);
  }
}