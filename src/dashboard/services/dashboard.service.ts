import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShortlistedCandidatesRepository } from "src/shortlisted-candidate/repositories/shortlisted-candidates.repository";
import { DashboardStats } from "../dto/dashboard.dto";
import { JobRepository } from "src/jobs/repositories/job.repository";
import { InterviewRepository } from "src/interviews/repositories/interview.repository";
import { isAbsolute } from "path";

@Injectable()
export class DashboardService {
  constructor(
    private readonly candidatesRepository: ShortlistedCandidatesRepository,
    private readonly jobRepository: JobRepository,
    private readonly interviewRepository: InterviewRepository
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const totalJob = await this.jobRepository.countByFilter({
        isActive: true,
      });
      const totalInactiveCandidates =
        await this.candidatesRepository.countByFilter({ isDeleted: null });
      const countInterviewsThisWeek =
        await this.interviewRepository.countInterviewsThisWeek();

      const hiringRate = async () => {
        const totalHiredCandidates =
          await this.candidatesRepository.countByFilter({ status: "hired" });
        const totalCandidates = await this.candidatesRepository.count();
        const hired = 0 ? 0 : (totalHiredCandidates / totalCandidates) * 100;

        return hired.toFixed(2);
      };

      return {
        totalJob,
        totalInactiveCandidates,
        countInterviewsThisWeek,
        hiringRate: await hiringRate(),
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch dashboard stats");
    }
  }
}
