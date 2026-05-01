import { Response } from 'express';
import { BuildUpdWordDocxUseCase } from './application/use-cases/build-upd-word-docx.use-case';
import { ParseExcelUseCase } from './application/use-cases/parse-excel.use-case';
import { GenerateDocxRequestDto, UploadExcelResponseDto } from './upload-excel.types';
export declare class UploadExcelController {
    private readonly parseExcelUseCase;
    private readonly buildUpdWordDocxUseCase;
    constructor(parseExcelUseCase: ParseExcelUseCase, buildUpdWordDocxUseCase: BuildUpdWordDocxUseCase);
    upload(file?: Express.Multer.File): Promise<UploadExcelResponseDto>;
    generateDocx(payload: GenerateDocxRequestDto, res: Response): Promise<void>;
}
