import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserDto{
    @IsString()
    name!: string;

    @IsString()
    role!: string;

}
export class UpdateUserDto{
    @IsUUID()
    id?: string;

    @IsString()
    name?: string;

    @IsString()
    role?: string;
}