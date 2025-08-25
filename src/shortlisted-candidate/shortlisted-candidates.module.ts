import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShortlistedCandidatesController } from "./controller/shortlisted-candidates.controller";
import { DashboardController } from "./controller/dashboard.controller";
import {
  ShortlistedCandidates,
  ShortlistedSchema,
} from "./entities/shortlisted-candidates.schema";
import { ShortlistedCandidatesRepository } from "./repositories/shortlisted-candidates.repository";
import { ShortlistedCandidatesService } from "./services/shortlisted-candidates.service";
import { DashboardService } from "./services/dashboard.service";
import { JwtService } from "@nestjs/jwt";
import { JobRepository } from "src/jobs/repositories/job.repository";
import { JobsModule } from "src/jobs/jobs.module";
import { HiringPipelineController } from "./controller/hiring-pipeline.controller";
import { HiringPipelineService } from "./services/hiring-pipeline.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortlistedCandidates.name, schema: ShortlistedSchema },
      
    ]),
    JobsModule
  ],
  controllers: [ShortlistedCandidatesController, DashboardController,HiringPipelineController],
  providers: [
    ShortlistedCandidatesService,
    ShortlistedCandidatesRepository,
    DashboardService,
    JwtService,
    JobRepository,
    HiringPipelineService
    
  ],
})
export class ShortlistedCandidatesModule {}
