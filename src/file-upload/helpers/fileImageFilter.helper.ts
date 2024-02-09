export const fileImageFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({ file })
    if ( !file ) return callback( new Error('No hay archivo'), false );

    const fileExptension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg','jpeg','png'];

    if (  validExtensions.includes( fileExptension ) ) {
        return callback( null, true );
    } else {
        return callback( new Error('Tipo de archivo invalido (.jpg, .jpeg, .png,'), false );
    }

}