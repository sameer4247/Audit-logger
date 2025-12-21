import { Request, Response, NextFunction } from "express";
import { sendCustomResponse } from "../../common/utils/custom-response";
import { HTTP_RESPONSE } from "../../common/constants/httpResponse";
import { prisma } from "../../db/prisma";
import { CustomError } from "../../common/utils/custom-error";

export class HealthController{
    async getHealth(req: Request, res: Response, next: NextFunction){
            try {
                const getDBHealth =  await prisma.$executeRaw`SELECT 1`;
                sendCustomResponse({res, statusCode: HTTP_RESPONSE.SUCCESS.STATUS.OK, message: "success", data : {
                    "server-state": "healthy",
                    "db-state": "healthy"
                }})
            } catch (error) {
                console.error(error);
                throw new CustomError({errorCode: HTTP_RESPONSE.ERROR.MESSAGE.INTERNAL_SERVER_ERROR, message:"someting went wrong",statusCode: 500})
            }
    }
}