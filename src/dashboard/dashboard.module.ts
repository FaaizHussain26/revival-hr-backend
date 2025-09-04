import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobsModule } from "src/jobs/jobs.module";

import { InterviewModule } from "src/interviews/interview.module";
import { DashboardController } from "./controller/dashboard.controller";
import { DashboardService } from "./services/dashboard.service";
import { ShortlistedCandidatesModule } from "src/shortlisted-candidate/shortlisted-candidates.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [JobsModule, ShortlistedCandidatesModule, InterviewModule],
  controllers: [DashboardController],
  providers: [DashboardService,JwtService],
})
export class DashboardModule {}
