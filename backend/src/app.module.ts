import { Module } from '@nestjs/common';
import { UploadExcelModule } from './upload-excel/upload-excel.module';

@Module({
  imports: [UploadExcelModule],
})
export class AppModule {}
