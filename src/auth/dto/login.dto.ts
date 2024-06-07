import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @IsEmail()
    @MaxLength(50)
    correo: string;

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