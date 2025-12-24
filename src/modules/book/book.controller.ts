import { Request, Response, NextFunction } from 'express';
import { BookService } from './book.service';
import { sendCustomResponse } from '../../common/utils/custom-response';
import { HTTP_RESPONSE } from '../../common/constants/httpResponse';
import { createPaginatedResult } from '../../common/utils/pagination';

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
  
  getBookList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const cursor = req.query.cursor as string | undefined;
      const bookList = createPaginatedResult(await this.bookService.getBookList(limit, cursor), limit, "id");
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: HTTP_RESPONSE.SUCCESS.MESSAGE.OK, data: bookList});
    } catch (error) {
      next(error);
    }
  }
   getBookById = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const book = await this.bookService.getBookById(req.params.id);
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: HTTP_RESPONSE.SUCCESS.MESSAGE.OK, data: book});
    } catch (err) {
        next(err);
    }
  }
  createBook  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {user} = req as any;
      const book = await this.bookService.createBook({...req.body, createdBy: user.id});
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_CREATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  createBookMany  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.createBookMany(req.body);
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_CREATED, data: book});
    } catch (err) {
      next(err);
    }
  };
  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {user} = req as any;
      const book = await this.bookService.updateBook(req.params.id, {...req.body, updatedBy: user.id});
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_UPDATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.bookService.deleteBook(req.params.id);
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.CREATED, message: HTTP_RESPONSE.SUCCESS.MESSAGE.BOOK_DELETED, data: book});
    } catch (err) {
      next(err);
    }
  };
}