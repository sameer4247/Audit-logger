import { Router } from 'express';
import { HealthController } from '../modules/health/health.controller';

class HealthRouter {
  public router: Router;
  private healthController: HealthController;
  constructor() {
    this.router = Router();
    this.healthController = new HealthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Requirements: All book routes require authentication [cite: 60]
    // this.router.use(authenticate);

    this.getRoutes();
  }
  private getRoutes(){
    this.router.get('/', this.healthController.getHealth);
  }
}

export default new HealthRouter().router;