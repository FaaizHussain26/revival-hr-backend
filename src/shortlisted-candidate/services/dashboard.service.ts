import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DashboardStats } from '../controller/dashboard.dto';
import { ShortlistedCandidatesRepository } from '../repositories/shortlisted-candidates.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly candidatesRepository: ShortlistedCandidatesRepository,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [highestScoringCandidate] = await this.candidatesRepository.findSortedLimited(
      { }, // filter
      { match_score: -1 }, // sort
      1 // limit
    );

    const totalCandidates = await this.candidatesRepository.count();
    const totalInactiveCandidates = await this.candidatesRepository.countByFilter({ isDeleted: true });
    const totalMatchedCandidates = await this.candidatesRepository.countByFilter({ job_matched: { $in: [true, 'Yes', 'yes'] } });

    return {
      highestScoringCandidate,
      totalCandidates,
      totalInactiveCandidates,
      totalMatchedCandidates,
    };
  }
}
