import { Injectable } from '@nestjs/common';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

@Injectable()
export class PdfParseFilePipe extends ParseFilePipe {
    constructor() {
        super({
            validators: [
                new MaxFileSizeValidator({ maxSize: 24000000 }),
                new FileTypeValidator({ fileType: 'application/pdf' }),
            ],
        });
    }
}