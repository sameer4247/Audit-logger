import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendCustomResponse } from '../../common/utils/custom-response';
import { HTTP_RESPONSE } from '../../common/constants/httpResponse';
import { createPaginatedResult } from '../../common/utils/pagination';

export class UserController {
  constructor(private userService: UserService) {
  }

  getUserList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const cursor = req.query.cursor as string | undefined;
      const users = createPaginatedResult(await this.userService.getUserList(limit, cursor), limit, 'id');
      return sendCustomResponse({ res, statusCode: 200, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_CREATED, data: users });
    } catch (err) {
      next(err);
    }
  }
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return sendCustomResponse({ res, statusCode: 200, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_CREATED, data: user });
    } catch (err) {
      next(err);
    }
  }
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return sendCustomResponse({ res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_CREATED, data: user });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      return sendCustomResponse({ res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_UPDATED, data: user });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      return sendCustomResponse({ res, statusCode: 201, message: HTTP_RESPONSE.SUCCESS.MESSAGE.USER_DELETED, data: user });
    } catch (err) {
      next(err);
    }
  };
}