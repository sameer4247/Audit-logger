import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE } from "../common/constants/httpResponse";
import { getContext } from "../common/utils/context";
export const  handleErrorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) =>{
        const { statusCode = HTTP_RESPONSE.ERROR.STATUS.BAD_REQUEST, errorCode = "ERROR", message = "something went wrong"} = error;
        const requestId = getContext()?.requestId;
        return res.status(statusCode).json({
            error: {
                code: errorCode,
                message,
                details: error.details,
                requestId
                // requestId: context?.requestId
            }
        });
}