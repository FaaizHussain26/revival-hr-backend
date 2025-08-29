import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { File } from "multer";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PdfParseFilePipe } from "src/common/pipes/parse-pipe.pipe";
import { UploadFileDto } from "../dto/upload-file.dto";
import { ResumeAnalyzerService } from "../service/resume-analyzer.service";

@Controller("resume-analyzer")
@ApiBearerAuth()
@ApiTags("resume-analyzer")
export class ResumeAnalyzerController {
  constructor(private readonly resumeAnalyzerService: ResumeAnalyzerService) {}

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Upload a PDF file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FileInterceptor("file"))
  analyzer(
    @Body() payload: UploadFileDto,
    @UploadedFile(PdfParseFilePipe)
    file: File
  ) {
    return this.resumeAnalyzerService.analyzer(payload, file);
  }
}
