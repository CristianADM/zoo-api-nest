import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateAnimalDto {
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
    
    @IsNumber()
    @IsPositive()
    idEspecie: number;
}
