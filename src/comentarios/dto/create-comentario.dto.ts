import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateComentarioDto {
    
    @IsString()
    @MaxLength(500)
    @Transform(({value}) => {
        if (typeof value !== 'string') {
            return value + "";
        }
        return value.trim();
    })
    @IsNotEmpty()
    cuerpo: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    idAnimal?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    idComentarioPadre?: number;
}
