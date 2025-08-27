import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'src/jobs/entities/job.schema';
import { JobRepository } from 'src/jobs/repositories/job.repository';
import { ResumeAnalyzerController } from './controller/resume-analyzer.controller';
import { ResumeAnalyzerService } from './service/resume-analyzer.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
    controllers:[ResumeAnalyzerController],
    providers:[ResumeAnalyzerService,ConfigService,JobRepository,JwtService]
})
export class ResumeAnalyzerModule {}
