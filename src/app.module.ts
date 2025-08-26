import { Logger, Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { RolesGuard } from "./common/guards/role.guard";
import { AppMailerModule } from "./common/mails/mailer/email.module";
import { UserSeeder } from "./seeder/user.seeder";
import { UserRepository } from "./users/repositories/user.repository";
import { UsersModule } from "./users/users.module";

import { JobsModule } from "./jobs/jobs.module";
import { SkillModule } from "./skills/skill.module";
import { ShortlistedCandidatesModule } from "./shortlisted-candidate/shortlisted-candidates.module";
import { InterviewModule } from "./interviews/interview.module";
// import { ResumeAnalyzerModule } from './resume-analyzer/resume-analyzer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>("MONGO_URI");
        if (!uri) {
          throw new Error("MONGO_URI is not defined in .env");
        }
        Logger.log("MongoDB connected", uri);
        return {
          uri,
          dbName: configService.get<string>("MONGO_DB_NAME"),
        };
      },
    }),

    AuthModule,
    UsersModule,
    AppMailerModule,
    ShortlistedCandidatesModule,
    JobsModule,
    SkillModule,
    InterviewModule,
    // ResumeAnalyzerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserSeeder,
    UserRepository,
  ],
})
export class AppModule {}
