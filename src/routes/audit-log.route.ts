import { Router } from 'express';
import { AuditLogController } from '../modules/audit-log/audit-log.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { AuditLogService } from '../modules/audit-log/audit-log.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuditLogDto } from '../modules/audit-log/audit-log.dto';
import { AuditLogRepository } from '../modules/audit-log/audit-log.repository';

class AuditLogRouter {
  public router: Router;
  private readonly audiLogRepository: AuditLogRepository
  private readonly auditLogController: AuditLogController;
  private readonly auditLogService: AuditLogService;
  constructor() {
    this.router = Router();
    this.audiLogRepository = new AuditLogRepository();
    this.auditLogService = new AuditLogService(this.audiLogRepository);
    this.auditLogController = new AuditLogController(this.auditLogService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware(["admin"]));
    this.setGetRoutes();
  }

  private setGetRoutes() {
    this.router.get('/', validationMiddleware(AuditLogDto), this.auditLogController.listAudit);
    this.router.get('/:id', this.auditLogController.listAuditById);
  }

}

export default new AuditLogRouter().router;