import { Request, Response, NextFunction } from 'express';
import { BookService } from './book.service';
import { sendCustomResponse } from '../../common/utils/custom-response';
import { HTTP_RESPONSE } from '../../common/constants/httpResponse';

export class BookController {
  constructor(private bookService: BookService) {
    this.bookService = bookService;
  }

  /**
   * @description - return cursor paginated list of books
   * @param req 
   * @param res 
   * @param next 
   */
//   async getList(req: Request, res: Response, next: NextFunction){
//         try {
//             const bookList = await this.bookService.findAll()
//         } catch (error) {
            
//         }
//   }

   getBookById = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const book = await this.bookService.findById(req.params.id);
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: HTTP_RESPONSE.SUCCESS.MESSAGE.OK, data: book});
    } catch (err) {
        next(err);
    }
  }
  createBook  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.create(req.body);
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_CREATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.update(req.params.id, req.body);
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_UPDATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.delete(req.params.id);
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_DELETED, data: book});
    } catch (err) {
      next(err);
    }
  };
}