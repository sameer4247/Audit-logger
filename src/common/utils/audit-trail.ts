import { compare } from 'fast-json-patch';
import  {prisma} from '../../db/prisma';
import { ActionType } from '../../prisma/generated/primsa/enums';
import { auditConfig, AuditableEntity, getAuditConfig } from '../../config/audit.config'
import { getLogger } from './logger';
import { AsyncContext, getContext } from './context';


export type AuditTrackerType = {
    entity: AuditableEntity,
    entityId: string,
    action: ActionType,
    newState: any,
    oldState: any,
    actorId: string,
    requestId: string
}
export class AuditTracker {
  private logger = getLogger();

  constructor() {}

  async track(
    entity: AuditableEntity,
    entityId: string,
    action: ActionType,
    oldState: any,
    newState?: any,
    actorId?: string,
    requestId?: string
  ): Promise<void> {
    console.log('inside track')
    const config = getAuditConfig(entity);
    
    if (!config?.track) return;
    if (!config.actions.includes(action as any)) return;

    try {
        const ctx = getContext() as AsyncContext;
        actorId = actorId || ctx.userId;
        requestId = requestId || ctx.requestId;
        newState
      // Calculate patch
      let patch = [];
      if (action === 'create') {
        patch = [{ op: 'add', path: '', value: newState }]; //create
      } else {
        //calc diff for update/delete
        patch = compare(this.excludeFields(oldState, config.exclude), 
                       this.excludeFields(newState, config.exclude));
      }
      // Redact sensitive fields
      patch = this.redactPatch(patch, config.redact);
      await prisma.auditLog.create({
        data: {
          entity,
          entityId,
          action,
          actorId : actorId ?? '',
          requestId,
          diff: JSON.stringify(patch),
          timestamp: new Date()
        }
      });

      this.logger.debug({
        msg: 'Audit tracked',
        entity,
        entityId,
        action,
        actorId,
        requestId,
        userId: actorId
      });
    } catch (error) {
      this.logger.error({
        msg: 'Audit tracking failed',
        entity,
        entityId,
        action,
        actorId,
        userId: actorId,
        requestId,
        error
      });
    }
  }

  private excludeFields(obj: any, exclude: string[]): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = { ...obj };
    exclude.forEach(field => {
      delete result[field];
    });
    return result;
  }

  private redactPatch(patch: any[], redact: string[]): any[] {
    return patch.map(op => {
      const path = op.path?.split('/');
      if (redact.includes(path)) {
        return { ...op, value: '[REDACTED]' };
      }
      return op;
    });
  }
}
