//Prisma client extension for Audit logging
import { structuredClone } from "node:worker_threads";
import { AuditableEntity, auditConfig, isAuditableEntity } from "../../config/audit.config";
import { ActionType, Prisma } from "../../prisma/generated/primsa/client"
import { AuditTracker } from "./audit-trail";

const auditTracker = new AuditTracker();
export const auditExtension = Prisma.defineExtension((client) => {
    return client.$extends({
        name: 'audit-extension',
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    if (!isAuditableEntity(model)) {
                        return query(args)
                    }
                        const entity = model as AuditableEntity;
                        let oldState;
                        //get exisitng data -oldState
                        if (['update', 'delete'].includes(operation)) {
                            try {
                                oldState = await (client as any)?.[model].findUnique({
                                where : (args as any).where
                            })
                            } catch (error) {
                                //continue;
                            }
                        }
                        const res: any = await query(args);
                        const newState = {...res};
                        auditTracker.track({
                            entity, entityId:  oldState?.id || (newState as any)?.id,action: operation as ActionType, oldState, newState});
                        return res ;
                }
            }
        }
    })

});
