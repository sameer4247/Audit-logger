//TODO : seed auditConfig to DB
export const auditConfig = {
  Book: { 
    track: true, 
    exclude: ['updatedAt', 'createdAt', 'deletedAt'], 
    actions: ['create', 'update', 'delete'],
    redact: [] 
  },
  User: { 
    track: true, 
    exclude: ["updatedAt", "createdAt","deletedAt"], 
    redact: ['credentials'] ,
    actions: ['create', 'update','delete']
  },
} ;

export type AuditableEntity = keyof typeof auditConfig;

export type AuditAction = (typeof auditConfig)[AuditableEntity]['actions'][number];

export function isAuditableEntity(entity: string): boolean {
  return entity in auditConfig && auditConfig[entity as AuditableEntity].track;
}

export function getAuditConfig(entity: AuditableEntity) {
  return auditConfig[entity];
}
