import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Controller('.well-known/pki-validation')
export class PkiValidationController {
    @Get('F12AE154199C39F0A4C13EE8D4F66B41.txt')
    serveAuthFile(@Res() res: Response) {
        const authFilePath = path.resolve(__dirname, 'F12AE154199C39F0A4C13EE8D4F66B41.txt');
        res.sendFile(authFilePath);
    }
}
