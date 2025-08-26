import { Module } from "@nestjs/common";
import { Interviews, InterviewSchema } from "./entities/interview.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewController } from "./controller/interview.controller";
import { InterviewService } from "./services/interview.service";
import { InterviewRepository } from "./repositories/interview.repository";
import { JwtService } from "@nestjs/jwt";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { ShortlistedCandidatesRepository } from "src/shortlisted-candidate/repositories/shortlisted-candidates.repository";
import { ShortlistedCandidatesModule } from "src/shortlisted-candidate/shortlisted-candidates.module";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [InterviewController],
  imports: [
    MongooseModule.forFeature([
      { name: Interviews.name, schema: InterviewSchema },
    ]),
    ShortlistedCandidatesModule,
    EventEmitterModule.forRoot(),
  ],

  providers: [
    InterviewService,
    InterviewRepository,
    JwtService,
    ShortlistedCandidatesRepository,
    ConfigService,
  ],
})
export class InterviewModule {}
