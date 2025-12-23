import { Request, Response, NextFunction } from "express";
import { AuditableEntity, getAuditConfig } from "../config/audit.config";
import {prisma } from '../db/prisma';
import { AuditTracker } from "../common/utils/audit-trail";
import { getLogger } from "../common/utils/logger";
import { getContext } from "../common/utils/context";
import { ActionType } from "../prisma/generated/primsa/enums";
const methodToActionMap: any = {
    POST : "create",
    PATCH : "update",
    PUT: "update",
    DELETE: "delete"
}
const auditTracker =  new AuditTracker();
/**
 * @description - fetch Old state of resource where action will performed and create audit context
 * map audit-config actions to req.method
 * extract entity from path
 * @param req 
 * @param res 
 * @param next 
 */
export async function auditLogMiddleware(req: Request, res: Response, next: NextFunction){
  let entity: AuditableEntity, entityId: string, action: ActionType, oldState: any , newState: any, actorId, requestId;
    try {
        console.log("inside audit")
        const originalJson = res.json;
        res.json = function(body){
            newState = body?.data;
            return originalJson.call(this, body);
        }
        console.log(req.url);
        entity = req.url?.split("/")?.[3]?.toLowerCase() as AuditableEntity;
        const config = getAuditConfig(entity);
        console.log(entity, config);
        if (!config) return next();
        action = methodToActionMap[req.method];
        console.log(action);
        if (action in config?.actions) {
            entityId = req.params.id;
            if (entityId) {
                //Query DB for "Old Data"
                oldState= await (prisma as any)[entity].findUnique({
                    where: { id: entityId }
                }) || {};
                Object.assign(req, oldState);
                res.on('finish', () => {
                    console.log('inside finish')
                    // auditTracker.track(entity, entityId, action, oldState,newState);
                });
            }
        }
        next();
    } catch (error) {
        next();
    }
  
  next();
}