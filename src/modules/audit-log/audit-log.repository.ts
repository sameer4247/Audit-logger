import { prisma } from "../../db/prisma";
import { AuditLog, Prisma } from "../../prisma/generated/primsa/client";
import { HTTP_RESPONSE } from "../../common/constants/httpResponse";
import { decodeCursor } from "../../common/utils/pagination";
export class AuditLogRepository {
    constructor() { }
    async findMany(
        limit: number = 10,
        cursor?: string,
        query?: any
    ) {
        const gte: Date | undefined = query?.from ? new Date(query.from) : undefined;
        const lte: Date | undefined = query?.to ? new Date(query.to) : undefined;
        const fieldsChanged: string[] = query?.fieldsChanged ? query?.fieldsChanged.split(",").map((el: string) => `/${el}`) : [];
        delete query.from;
        delete query.to;
        delete query.fieldsChanged;
        const decodedCursor = decodeCursor(cursor);
        const audits = await prisma.auditLog.findMany({
            take: limit + 1,
            skip: 0,
            where: {
                ...query,
                timestamp: { gte, lte },
                OR: fieldsChanged.map(path => ({
                    diff: {
                        // This looks for the exact string '"path":"/role"' inside the JSON string
                        contains: `"path":"${path}"`
                    }
                }))
            },
            cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
            orderBy: { timestamp: 'desc' }
        });
        return audits;
    }
    async findOne(id: string){
    return prisma.auditLog.findUniqueOrThrow({
        where: { id }
    }).catch(error => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw HTTP_RESPONSE.ERROR.DB[errorCode];
        }
    });
}

}