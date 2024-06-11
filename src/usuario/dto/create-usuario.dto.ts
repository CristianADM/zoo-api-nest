import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsEmail()
    @MaxLength(50)
    correo: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    @Transform(({value}) => {
        if (typeof value !== 'string') {
            return value + "";
        }
        return value.trim();
    })
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @MinLength(6)
    @MaxLength(200)
    @Transform(({value}) => {
        if (typeof value !== 'string') {
            return value + "";
        }
        return value.trim();
    })
    @IsNotEmpty()
    contrasenna: string;
}
