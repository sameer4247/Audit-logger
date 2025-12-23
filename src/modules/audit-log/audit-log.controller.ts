import { Request, Response, NextFunction } from 'express';
import { sendCustomResponse } from '../../common/utils/custom-response';
import { HTTP_RESPONSE } from '../../common/constants/httpResponse';
import { createPaginatedResult } from '../../common/utils/pagination';
import { AuditLogService } from './audit-log.service';

export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {
    this.auditLogService = auditLogService;
  }

  /**
   * @description - return cursor paginated list of books
   * @param req 
   * @param res 
   * @param next 
   */
  
  listAudit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const cursor = req.query.cursor as string | undefined;
      const {limit: _a, cursor: _b, ...query} =req.query;
      const auditList = createPaginatedResult(await this.auditLogService.listAudit(limit, cursor, query), limit, "id");
      sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: HTTP_RESPONSE.SUCCESS.MESSAGE.OK, data: auditList});
    } catch (error) {
      next(error);
    }
  }
   listAuditById = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const audit = await this.auditLogService.listAuditById(req.params.id);
        sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: HTTP_RESPONSE.SUCCESS.MESSAGE.OK, data: audit});
    } catch (err) {
        next(err);
    }
  }
}