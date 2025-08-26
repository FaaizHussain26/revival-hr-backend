import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateInterviewDto } from "../dto/create-interview.dto";
import { UpdateInterviewDto } from "../dto/update-interview.dto";
import { InterviewRepository } from "../repositories/interview.repository";
import { successResponse } from "src/common/response/response";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ShortlistedCandidatesRepository } from "src/shortlisted-candidate/repositories/shortlisted-candidates.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class InterviewService {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly candidatesRepository: ShortlistedCandidatesRepository,
    private eventEmitter: EventEmitter2,
     private readonly configService: ConfigService
  ) {}

  async create(payload: CreateInterviewDto) {
    try {
      
      const candidate = await this.candidatesRepository.findById(
        payload.candidate
      );
      if (!candidate) {
        throw new NotFoundException("Candidate Id is not valid");
      }
      const candidateExists = await this.interviewRepository.findByCandidate(
        payload.candidate
      );
      if (candidateExists) {
        throw new ConflictException(
          "Candidate already has an interview scheduled"
        );
      }
      const email = await this.eventEmitter.emitAsync("interview.scheduled", {
        ...payload,
        fromEmail: this.configService.get<string>("BREVO_USER"),
        candidateName: candidate.applicant_name,
        candidateEmail: candidate.applicant_email,
      });
      console.log(email);
      if (!email) {
        throw new BadRequestException("Email not send.");
      }
      // // const Interview = await this.interviewRepository.create(payload);
      // if (!Interview) {
      //   throw new BadRequestException("Interview creation failed");
      // }

      return successResponse("Interview created successfully", email);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error("Error creating Interview:", error);
      throw new InternalServerErrorException(
        "An unexpected error occurred while creating the Interview."

      );
    }
  }
}
