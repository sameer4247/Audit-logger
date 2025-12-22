import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService) {
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
      console.log(req.params.id);
        const book = await this.userService.findById(req.params.id);
        return book;
    } catch (err) {
        next(err);
    }
  }
  createBook  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.userService.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.userService.update(req.params.id, req.body);
      res.json(book);
    } catch (err) {
      next(err);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.delete(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}