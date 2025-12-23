import { AuditLogRepository } from './audit-log.repository';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}
  async listAudit(limit: number, cursor: string | undefined, query: object){
      return this.auditLogRepository.findMany(limit, cursor, query)
  }

  listAuditById(id: string){
    return this.auditLogRepository.findOne(id);
  }

}