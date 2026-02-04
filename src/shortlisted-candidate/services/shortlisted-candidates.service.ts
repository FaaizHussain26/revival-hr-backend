import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import {
  paginationResponse,
  successResponse,
} from "src/common/response/response";
import { JobRepository } from "src/jobs/repositories/job.repository";
import { CreateCandidateDto } from "../dto/create-shortlisted-candidates.dto";
import { UpdateCandidateStatusDto } from "../dto/update-candidate-status.dto";
import { TalentMatchRepository } from "../repositories/talent-match.repository";

@Injectable()
export class ShortlistedCandidatesService {
  constructor(
    private readonly candidatesRepository: TalentMatchRepository,
    private readonly jobRepository: JobRepository
  ) {}

  async create(payload: CreateCandidateDto) {
    try {
      const existingCandidate = await this.candidatesRepository.findByEmail(
        payload.applicant_email
      );
      if (existingCandidate) {
        payload.isDuplicated = true;
      }
      if (payload.job) {
        const jobexists = await this.jobRepository.findById(payload.job);
        if (!jobexists) {
          throw new BadRequestException("Job does not exist");
        }
        if (!jobexists.isActive) {
          throw new BadRequestException("Job is not active");
        }
      }
      const candidate = await this.candidatesRepository.create(payload);
      if (!candidate) {
        throw new BadRequestException("Candidate creation failed");
      }
      return successResponse("Candidate created successfully", candidate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while creating the candidate."
      );
    }
  }

  async findAll(query: PaginationQueryDto) {
    await this.candidatesRepository.markDuplicates();
    const allCandidates =
      await this.candidatesRepository.findAllPaginatedAndFiltered(query);
    return paginationResponse(
      "Candidates retrieved successfully",
      allCandidates.data,
      allCandidates.total,
      allCandidates.current_page,
      allCandidates.last_page,
      allCandidates.per_page
    );
  }

  async findById(id: string) {
    try {
      const candidate = await this.candidatesRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException("Candidate not found");
      }
      return successResponse("Candidate retrieved successfully", candidate);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while retrieving the candidate."
      );
    }
  }
  async findCandidatesWithJobs() {
    return successResponse(
      "Candidate retrieved successfully",
      await this.candidatesRepository.aggregateCandidatesWithJobs()
    );
  }
  async countCandidates() {
    const [totalCandidates, activeCandidates, inactiveCandidates] =
      await Promise.all([
        this.candidatesRepository.count(),
        this.candidatesRepository.countByFilter({ deletedAt: null }),
        this.candidatesRepository.countByFilter({ deletedAt: { $ne: null } }),
      ]);

    return successResponse("Candidates count retrieved successfully", {
      totalCandidates: totalCandidates,
      activeCandidates: activeCandidates,
      inactiveCandidates: inactiveCandidates,
    });
  }

  async delete(id: string) {
    try {
      const candidate = await this.candidatesRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException("Candidate not found");
      }
      if (candidate.deletedAt !== null) {
        throw new BadRequestException("Candidate is already deleted");
      }
      const deletedCandidate = await this.candidatesRepository.delete(id);
      if (!deletedCandidate) {
        throw new BadRequestException("Candidate deletion failed");
      }
      return successResponse(
        "Candidate deleted successfully",
        deletedCandidate
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while deleting the candidate."
      );
    }
  }

  async restore(id: string) {
    try {
      const candidate = await this.candidatesRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException("Candidate not found");
      }
      if (candidate.deletedAt == null) {
        throw new BadRequestException("Candidate is not deleted");
      }
      const candidateRestored = await this.candidatesRepository.restore(id);
      if (!candidateRestored) {
        throw new BadRequestException("Candidate restoration failed");
      }
      return successResponse(
        "Candidate restored successfully",
        candidateRestored
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while restoring the candidate."
      );
    }
  }

  async permanentDelete(id: string) {
    try {
      const candidate = await this.candidatesRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException("Candidate not found");
      }
      if (candidate.deletedAt == null) {
        throw new BadRequestException("Candidate is not deleted");
      }
      const deletedCandidate =
        await this.candidatesRepository.permanentDelete(id);
      if (!deletedCandidate) {
        throw new BadRequestException("Candidate permanent deletion failed");
      }
      return successResponse(
        "Candidate permanently deleted successfully",
        deletedCandidate
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while permanently deleting the candidate."
      );
    }
  }
}
