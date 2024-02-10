import { BadRequestException } from "@nestjs/common";

export const filePdfFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({ file })
    if ( !file ) return callback( new Error('No hay archivo'), false );

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['pdf'];

    if (  validExtensions.includes( fileExtension ) ) {
        return callback( null, true );
    } else {
        return callback(  new BadRequestException(`Tipo de archivo invalido (.${fileExtension})`), false );
    }

}