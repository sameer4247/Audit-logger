import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Role } from "../../prisma/generated/primsa/enums";
export class CreateUserDto{
    @IsString()
    name!: string;

    @IsString()
    @IsEnum(Role)
    role!: string;

}
export class UpdateUserDto{
    @IsUUID()
    id?: string;

    @IsString()
    name?: string;

    @IsString()
    @IsEnum(Role)
    role?: string;
}