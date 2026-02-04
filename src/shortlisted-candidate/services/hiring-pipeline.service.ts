import { successResponse } from "src/common/response/response";
import { TalentMatchRepository } from "../repositories/talent-match.repository";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UpdateCandidateStatusDto } from "../dto/update-candidate-status.dto";
@Injectable()
export class HiringPipelineService {
  constructor(
    private readonly candidatesRepository: TalentMatchRepository
  ) {}

  async findCandidatesWithStatus() {
    const candidatesWithStatus =
      await this.candidatesRepository.aggregateCandidatesWithStatus();
    return successResponse(
      "Candidate retrieved successfully ",
      candidatesWithStatus
    );
  }

  async updateCandidateStatus(id: string, status: UpdateCandidateStatusDto) {
    if (!status) {
      throw new BadRequestException("Status is required");
    }
    try {
      const candidate = await this.candidatesRepository.findById(id);
      if (!candidate) {
        throw new NotFoundException("Candidate not found");
      }
      const updatedCandidate =
        await this.candidatesRepository.updateCandidateStatus(id, status);

        return successResponse("Candidate status updated successfully", updatedCandidate);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while updating the candidate."
      );
    }
  }
}
