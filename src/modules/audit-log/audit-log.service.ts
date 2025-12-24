import { Prisma } from '../../prisma/generated/primsa/client';
import { AuditLogRepository } from './audit-log.repository';


export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}
  async listAudit(limit: number, cursor: string | undefined, query: object){
        const { from, to, fieldsChanged, ...otherFilters } = query as any;
        const gte: Date | undefined = from ? new Date(from) : undefined;
        const lte: Date | undefined = to ? new Date(to) : undefined;
        const pathFilter: string[] | undefined = fieldsChanged ? fieldsChanged.split(',')?.map((path: string) => ({
                    diff: {
                        contains: `"path":"/${path}"`
                    }
                })) : undefined;
        let timestamp: any;
        if(lte)timestamp = {lte};
        if(gte)timestamp = {...timestamp, gte};
      return this.auditLogRepository.findMany(limit, cursor, {timestamp, pathFilter, otherFilters});
  }

  listAuditById(id: string){
    return this.auditLogRepository.findOne(id);
  }

}