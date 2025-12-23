import { Router } from 'express';
import { UserController } from '../modules/user/user.controller';
// import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../modules/user/user.dto';
import { UserService } from '../modules/user/user.service';
import { authMiddleware } from '../middleware/auth.middleware';

class BookRouter {
  public router: Router;
  private readonly userController: UserController;
  private readonly userService;
  constructor() {
    this.router = Router();
    this.userService = new UserService();
    this.userController = new UserController(this.userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware([])); 
    this.setGetRoutes();
    this.setPostRoutes();
    this.setPatchRoutes(); // Use PATCH for updates 
    this.setDeleteRoutes();
  }

  private setGetRoutes() {
    this.router.get('/:id', this.userController.getUserById);
  }

  private setPostRoutes() {
    this.router.post(
      '/', 
      validationMiddleware(CreateUserDto), 
      this.userController.createUser
    );
  }

  private setPatchRoutes() {
    this.router.patch(
      '/:id', 
      validationMiddleware(UpdateUserDto), 
      this.userController.updateUser
    );
  }

  private setDeleteRoutes() {
    this.router.delete('/:id', this.userController.deleteUser);
  }
}

export default new BookRouter().router;