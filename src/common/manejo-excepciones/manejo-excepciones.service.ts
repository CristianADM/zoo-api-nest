import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class ManejoExcepcionesService {

    handleDBExceptions(error: any) {
        console.log(error);
        throw new InternalServerErrorException('Error Interno, Contacte al administrador');
    }
}
