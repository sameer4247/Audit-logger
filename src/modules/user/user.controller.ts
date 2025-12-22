import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendCustomResponse } from '../../common/utils/custom-response';
import { HTTP_RESPONSE } from '../../common/constants/httpResponse';

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

   getUserById = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const book = await this.userService.findById(req.params.id);
        return book;
    } catch (err) {
        next(err);
    }
  }
  createUser  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.userService.create(req.body);
      return sendCustomResponse({res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_CREATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.userService.update(req.params.id, req.body);
      return sendCustomResponse({res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_UPDATED, data: book});
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book =  await this.userService.delete(req.params.id);
      return sendCustomResponse({res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_DELETED, data: book});
    } catch (err) {
      next(err);
    }
  };
}