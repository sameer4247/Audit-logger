import { prisma } from "../../db/prisma";
import { User, Prisma } from "../../prisma/generated/primsa/client";
import { HTTP_RESPONSE } from "../../common/constants/httpResponse";
import { decodeCursor } from "../../common/utils/pagination";
import { DatabaseError } from "../../common/utils/custom-error";
export class UserRepository {
    async findMany(
        limit: number = 10,
        cursor?: string
    ) {
        const decodedCursor = decodeCursor(cursor);
        return prisma.user.findMany({
            take: limit + 1,
            skip: 0,
            cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
            omit: {
                "credentials": true
            },
            orderBy: { createdAt: 'desc' }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        });
    }
    async findOne(id: string) {
        return prisma.user.findUniqueOrThrow({
            where: { id },
            omit: {
                "credentials": true
            }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        });
    }
    async create(data: User) {
        return prisma.user.create({
            data,
            omit: {
                "credentials": true
            }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        });
    }

    async update(id: string, data: User) {
        return prisma.user.update({
            where: { id },
            data,
            omit: {
                "credentials": true
            }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        })
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }, omit: {
                "credentials": true
            }
        }).catch(error => {
            const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
            throw new DatabaseError(HTTP_RESPONSE.ERROR.DB[errorCode]);
        });
    }
}