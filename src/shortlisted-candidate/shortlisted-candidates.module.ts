import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShortlistedCandidatesController } from "./controller/shortlisted-candidates.controller";
import {
  ShortlistedCandidates,
  ShortlistedSchema,
} from "./entities/shortlisted-candidates.schema";
import { ShortlistedCandidatesRepository } from "./repositories/shortlisted-candidates.repository";
import { ShortlistedCandidatesService } from "./services/shortlisted-candidates.service";

import { JwtService } from "@nestjs/jwt";
import { JobsModule } from "src/jobs/jobs.module";
import { JobRepository } from "src/jobs/repositories/job.repository";
import { HiringPipelineController } from "./controller/hiring-pipeline.controller";
import { HiringPipelineService } from "./services/hiring-pipeline.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortlistedCandidates.name, schema: ShortlistedSchema },
    ]),
    JobsModule,
  ],
  controllers: [ShortlistedCandidatesController, HiringPipelineController],
  providers: [
    ShortlistedCandidatesService,
    ShortlistedCandidatesRepository,
    JwtService,
    JobRepository,
    HiringPipelineService,
  ],
  exports: [ShortlistedCandidatesRepository, MongooseModule],
})
export class ShortlistedCandidatesModule {}
