import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShortlistedCandidatesController } from "./controller/shortlisted-candidates.controller";
import {
  ShortlistedCandidates,
  ShortlistedSchema,
} from "./entities/shortlisted-candidates.schema";
import {
  TalentMatch,
  TalentMatchSchema,
} from "./entities/talent-match.schema";
import { ShortlistedCandidatesRepository } from "./repositories/shortlisted-candidates.repository";
import { TalentMatchRepository } from "./repositories/talent-match.repository";
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
      { name: TalentMatch.name, schema: TalentMatchSchema },
    ]),
    JobsModule,
  ],
  controllers: [ShortlistedCandidatesController, HiringPipelineController],
  providers: [
    ShortlistedCandidatesService,
    ShortlistedCandidatesRepository,
    TalentMatchRepository,
    JwtService,
    JobRepository,
    HiringPipelineService,
  ],
  exports: [TalentMatchRepository, MongooseModule],
})
export class ShortlistedCandidatesModule {}
