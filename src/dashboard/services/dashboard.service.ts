import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InterviewRepository } from "src/interviews/repositories/interview.repository";
import { JobRepository } from "src/jobs/repositories/job.repository";
import { TalentMatchRepository } from "src/shortlisted-candidate/repositories/talent-match.repository";
import { DashboardStats } from "../dto/dashboard.dto";

@Injectable()
export class DashboardService {
  constructor(
    private readonly candidatesRepository: TalentMatchRepository,
    private readonly jobRepository: JobRepository,
    private readonly interviewRepository: InterviewRepository
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const totalJob = await this.jobRepository.countByFilter({
        isActive: true,
      });
      const totalactiveCandidates =
        await this.candidatesRepository.countByFilter({ isDeleted: null });
      const countInterviewsThisWeek =
        await this.interviewRepository.countInterviewsThisWeek();

      const hiringRate = async () => {
        const totalHiredCandidates =
          await this.candidatesRepository.countByFilter({ status: "hired" });
        const totalCandidates = await this.candidatesRepository.count();
        const hired = `${(0 ? 0 : (totalHiredCandidates / totalCandidates) * 100).toFixed(0)}%`;

        return hired;
      };

      return {
        totalJob,
        totalactiveCandidates,
        countInterviewsThisWeek,
        hiringRate: await hiringRate(),
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch dashboard stats");
    }
  }
}
