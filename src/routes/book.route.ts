import { Router } from 'express';
import { BookController } from '../modules/book/book.controller';
// import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateBookDto, UpdateBookDto } from '../modules/book/book.dto';
import { BookService } from '../modules/book/book.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { sendCustomResponse } from '../common/utils/custom-response';
import { BookRepository } from '../modules/book/book.repository';

class BookRouter {
  public router: Router;
  private readonly bookRepository: BookRepository
  private readonly bookController: BookController;
  private readonly bookService: BookService;
  constructor() {
    this.router = Router();
    this.bookRepository = new BookRepository();
    this.bookService = new BookService(this.bookRepository);
    this.bookController = new BookController(this.bookService);
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
    this.router.get('/', this.bookController.getBookList);
    this.router.get('/:id', this.bookController.getBookById);
  }

  private setPostRoutes() {
    this.router.post(
      '/', 
      validationMiddleware(CreateBookDto), 
      this.bookController.createBook
    );
  }

  private setPatchRoutes() {
    this.router.patch(
      '/:id', 
      validationMiddleware(UpdateBookDto), 
      this.bookController.updateBook
    );
  }

  private setDeleteRoutes() {
    this.router.delete('/:id', this.bookController.deleteBook);
  }
}

export default new BookRouter().router;