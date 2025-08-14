import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from './controller/job.controller';
import { Job, JobSchema } from './entities/job.schema';
import { JobService } from './services/job.service';
import { JobRepository } from './repositories/job.repository';
import { JwtService } from '@nestjs/jwt';
import { EmbeddingService } from 'src/common/embeddings/embedding.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService, JobRepository, JwtService, EmbeddingService],
})
export class JobsModule {}
