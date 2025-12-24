import { prisma } from "../../db/prisma";
import { AuditLog, Prisma } from "../../prisma/generated/primsa/client";
import { HTTP_RESPONSE } from "../../common/constants/httpResponse";
import { decodeCursor } from "../../common/utils/pagination";
import { DatabaseError } from "../../common/utils/custom-error";
export class AuditLogRepository {
    constructor() { }
    async findMany(
        limit: number = 10,
        cursor?: string,
        query?: any
    ) {
        const { timestamp, pathFilter, otherFilters } = query;
        const decodedCursor = decodeCursor(cursor);
        return prisma.auditLog.findMany({
            take: limit + 1,
            skip: 0,
            where: {
                ...otherFilters,
                timestamp,
                OR: pathFilter
            },
            cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
            orderBy: { timestamp: 'desc' }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        }
        )

    }
    async findOne(id: string) {
        return prisma.auditLog.findUniqueOrThrow({
            where: { id }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        });
    }

}