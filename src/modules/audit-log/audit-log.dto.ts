import { IsDateString, IsOptional, IsString } from "class-validator";

export class AuditLogDto{
    @IsDateString()
    @IsOptional()
    from?: string

    @IsDateString()
    @IsOptional()
    to?: string

    @IsString()
    @IsOptional()
    entity?: string

    @IsString()
    @IsOptional()
    entityId?: string

    @IsString()
    @IsOptional()
    actorId?: string

    @IsString()
    @IsOptional()
    action?: string

    @IsString()
    @IsOptional()
    fieldsChanged?: string //comma-separated field names - maybe map to patch?

    @IsString()
    @IsOptional()
    requestId?: string
}