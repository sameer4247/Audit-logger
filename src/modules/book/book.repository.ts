import { CreateBookDto, UpdateBookDto } from "./book.dto";
import { prisma } from "../../db/prisma";
import { Book, Prisma } from "../../prisma/generated/primsa/client";
import { HTTP_RESPONSE } from "../../common/constants/httpResponse";
import { decodeCursor } from "../../common/utils/pagination";
export class BookRepository {
    constructor() {}
    async findMany(
        limit: number = 10,
        cursor?: string
    ) {
        const decodedCursor = decodeCursor(cursor);
        const books = await prisma.book.findMany({
            take: limit + 1,
            skip: 0,
            cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
        });
        return books;
    }
    async findOne(id: string){
        return prisma.book.findUniqueOrThrow({
            where : {id}
        }).catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
                throw HTTP_RESPONSE.ERROR.DB[errorCode];
            }
        });
    }
    async create(data: CreateBookDto) {
        return prisma.book.create({
            data: {
                ...data,
                //createdBy: userId,
            },
        }).catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
                throw HTTP_RESPONSE.ERROR.DB[errorCode];
            }
        });
    }

    async update(id: string, data: UpdateBookDto, userId?: string) {
        return prisma.book.update({
            where: { id },
            data: {
                ...data,
                updatedBy: userId,
            },
        }).catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
                throw HTTP_RESPONSE.ERROR.DB[errorCode];
            }
        })
    }

    async delete(id: string) {
        await prisma.book.delete({ where: { id } }).catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const errorCode = error?.code as keyof typeof HTTP_RESPONSE.ERROR.DB;
                throw HTTP_RESPONSE.ERROR.DB[errorCode];
            }
        });
    }
}