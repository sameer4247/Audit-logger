import { Router } from 'express';
import { BookController } from '../modules/book/book.controller';
// import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateBookDto, UpdateBookDto } from '../modules/book/book.dto';
import { BookService } from '../modules/book/book.service';

class BookRouter {
  public router: Router;
  private readonly bookController: BookController;
  private readonly bookService;
  constructor() {
    this.router = Router();
    this.bookService = new BookService();
    this.bookController = new BookController(this.bookService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Requirements: All book routes require authentication [cite: 60]
    // this.router.use(authenticate);

    this.setGetRoutes();
    this.setPostRoutes();
    this.setPatchRoutes(); // Use PATCH for updates 
    this.setDeleteRoutes();
  }

  private setGetRoutes() {
  //  this.router.get('/', this.bookController.getBooks);
    this.router.get('/:id', this.bookController.getBookById);
  }

  private setPostRoutes() {
    /**
     * POST /api/books [cite: 36, 114]
     * Uses combined DTO/Validator 
     */
    this.router.post(
      '/', 
      validationMiddleware(CreateBookDto), 
      this.bookController.createBook
    );
  }

  private setPatchRoutes() {
    /**
     * PATCH /api/books/:id [cite: 38, 116]
     */
    this.router.patch(
      '/:id', 
      validationMiddleware(UpdateBookDto), 
      this.bookController.updateBook
    );
  }

  private setDeleteRoutes() {
    /**
     * DELETE /api/books/:id [cite: 39, 118]
     */
    this.router.delete('/:id', this.bookController.deleteBook);
  }
}

export default new BookRouter().router;