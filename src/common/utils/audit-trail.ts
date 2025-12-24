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
    oldState?: any,
    actorId?: string,
    requestId?: string
}
export class AuditTracker {
  private logger = getLogger();

  constructor() {}
  async track(auditCtx: AuditTrackerType): Promise<void> {
    let { entity , entityId, action, actorId, oldState, newState, requestId} = auditCtx;
    const config = getAuditConfig(entity);
    if (!config?.track) return;
    if (!config.actions.includes(action as any)) return;

    try {
        const ctx = getContext() as AsyncContext;
        actorId = actorId || ctx.userId;
        requestId = requestId || ctx.requestId;
        newState = JSON.parse(JSON.stringify(newState));
        if(oldState) JSON.parse(JSON.stringify(oldState));
      // Calculate patch
      let patch = [];
      if (action === 'create') {
        actorId = actorId || newState.id;
        patch = compare({},this.excludeFields(newState, config.exclude));
      } else {
        //calc diff for update/delete
        patch = compare(this.excludeFields(oldState, config.exclude), 
                       this.excludeFields(newState, config.exclude));
      }
      // Redact sensitive fields
      patch = this.redactPatch(patch, config.redact);
      const auditData = await prisma.auditLog.create({
        data: {
          entity,
          entityId,
          action,
          actorId,
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
    patch = patch.map(op => {
      const path = op.path?.split('/')?.[1];
      if (redact.includes(path)) {
        return { ...op, value: '[REDACTED]' };
      }
      return op;
    });
    return patch;
  }
}
