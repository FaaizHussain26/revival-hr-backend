import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { successResponse } from "src/common/response/response";
import {
  canceledInterviewEmailTemplate,
  rescheduledInterviewEmailTemplate,
  scheduledInterviewEmailTemplate,
} from "src/common/utils/templates/email.template";
import { TalentMatchRepository } from "src/shortlisted-candidate/repositories/talent-match.repository";
import { v4 as uuidv4 } from "uuid";
import { CreateInterviewDto } from "../dto/create-interview.dto";
import { UpdateInterviewDto } from "../dto/update-interview.dto";
import { InterviewRepository } from "../repositories/interview.repository";
import { from } from "rxjs";

@Injectable()
export class InterviewService {
  constructor(
    private readonly interviewRepository: InterviewRepository,
    private readonly candidatesRepository: TalentMatchRepository,
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
      if (candidateExists && candidateExists.type === payload.type) {
        throw new ConflictException(
          "Candidate already has an interview scheduled"
        );
      }
      if (payload.scheduledAt < new Date()) {
        throw new BadRequestException("Scheduled date must be in the future.");
      }
      if (payload.duration <= 0) {
        throw new BadRequestException("Duration must be a positive number.");
      }
      if (payload.interviewer.length === 0) {
        throw new BadRequestException(
          "At least one interviewer must be specified."
        );
      }
      if (payload.status && payload.status !== "scheduled") {
        throw new BadRequestException(
          "New interview must have status 'scheduled'."
        );
      }
      const uId = uuidv4();
      const { subject, bodyForCandidate, bodyForInterviewer } =
        scheduledInterviewEmailTemplate(
          candidate.applicant_name,
          payload.location,
          payload.scheduledAt
        );
      const emailToCandidate = await Promise.all([
        this.eventEmitter.emitAsync("interview.scheduled", {
          payload: {
            ...payload,
            fromEmail: this.configService.get<string>("BREVO_USER"),
            candidateName: candidate.applicant_name,
            candidateEmail: candidate.applicant_email,
            method: "REQUEST",
            uId,
            sequence: 0,
          },
          recipients: [candidate.applicant_email],
          subject,
          body: bodyForCandidate,
        }),
        this.eventEmitter.emitAsync("interview.scheduled", {
          payload: {
            ...payload,
            fromEmail: this.configService.get<string>("BREVO_USER"),
            candidateName: candidate.applicant_name,
            candidateEmail: candidate.applicant_email,
            method: "REQUEST",
            uId,
            sequence: 0,
          },
          recipients: [...payload.interviewer],
          subject,
          body: bodyForInterviewer,
        }),
      ]);
      if (!emailToCandidate) {
        throw new BadRequestException("Email not send");
      }
      const interview = await this.interviewRepository.create(payload, uId);
      if (!interview) {
        throw new BadRequestException("Interview creation failed", interview);
      }

      return successResponse("Interview created successfully", interview);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while creating the Interview."
      );
    }
  }

  async findAll() {
    try {
      const interviews = await this.interviewRepository.findAll();
      return successResponse("Interviews fetched successfully", interviews);
    } catch (error) {
      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching the Interviews."
      );
    }
  }

  async findAllPaginatedAndFiltered(query: PaginationQueryDto) {
    try {
      const interviews =
        await this.interviewRepository.findAllPaginatedAndFiltered(query);
        await this.interviewRepository.autoDeleteOldInterviews();
      return successResponse("Interviews fetched successfully", interviews);
    } catch (error) {
      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching the Interviews."
      );
    }
  }

  async todayInterview() {
    try {
      const interviews = await this.interviewRepository.findByDate();
      return successResponse("Interviews fetched successfully", interviews);
    } catch (error) {
      throw new InternalServerErrorException(
        "An unexpected error occurred while fetching the Interviews."
      );
    }
  }

  async update(id: string, payload: UpdateInterviewDto) {
    try {
      const existingInterview = await this.interviewRepository.findById(id);
      if (!existingInterview) {
        throw new NotFoundException("Interview not found");
      }
      if (!existingInterview.eventId) {
        throw new BadRequestException(
          "Cannot update interview without eventId"
        );
      }
      if (payload.candidate) {
        throw new BadRequestException("Candidate field cannot be updated");
      }
      const candidate = await this.candidatesRepository.findById(
        existingInterview.candidate._id.toString()
      );
      if (!candidate) {
        throw new NotFoundException("Candidate Id is not valid");
      }
      if (
        payload.status === "scheduled" &&
        existingInterview.status === "scheduled"
      ) {
        throw new BadRequestException("Interview is already scheduled");
      }
      const uId = existingInterview.eventId;
      let subject = "";
      let bodyForCandidate = "";
      let bodyForInterviewer = "";
      let method = "";
      let sequence = 1;
      const now = new Date();
      if (payload.status == "rescheduled") {
        const preivousInterviewer = existingInterview.interviewer.filter(
          (x) => !payload.interviewer?.includes(x)
        );
        if (preivousInterviewer.length) {
          let sequenceNumber = 1;
          const template = canceledInterviewEmailTemplate(
            candidate.applicant_name
          );
          const previousInterviewerField = {
            scheduledAt: existingInterview.scheduledAt,
            duration: existingInterview.duration,
            type: existingInterview.type,
            interviewer: preivousInterviewer,
            location: existingInterview.location,
            status: existingInterview.status,
            notes: existingInterview.notes,
            eventId: existingInterview.eventId,
          };
          await this.eventEmitter.emitAsync("interview.scheduled", {
            payload: {
              ...previousInterviewerField,
              candidateName: candidate.applicant_name,
              candidateEmail: candidate.applicant_email,
              method: "CANCEL",
              sequence: sequenceNumber++,
              uId,
            },
            recipients: [...preivousInterviewer],
            subject: template.subject,
            body: template.bodyForInterviewer,
          });
        }

        if (!payload.scheduledAt) {
          throw new BadRequestException("New scheduled date must be provided.");
        }

        const newScheduleDate = new Date(payload.scheduledAt);
        const currentScheduleDate = new Date(existingInterview.scheduledAt);

        if (newScheduleDate < now) {
          throw new BadRequestException(
            "Cannot reschedule an interview that has already passed."
          );
        }

        if (currentScheduleDate.getTime() === newScheduleDate.getTime()) {
          throw new BadRequestException(
            "New schedule time must be different from the current one."
          );
        }

        const template = rescheduledInterviewEmailTemplate(
          candidate.applicant_name,
          (payload.location as string) || existingInterview.location,
          payload.scheduledAt as Date
        );
        subject = template.subject;
        bodyForCandidate = template.bodyForCandidate;
        bodyForInterviewer = template.bodyForInterviewer;
        method = "REQUEST";
      } else if (payload.status == "cancelled") {
        const allowedFields = ["status"];

        const payloadFields = Object.keys(payload);

        const hasInvalidFields = payloadFields.some(
          (field) => !allowedFields.includes(field)
        );

        if (hasInvalidFields) {
          throw new BadRequestException(
            "Only the 'status' field can be updated when cancelling an interview."
          );
        }
        const template = canceledInterviewEmailTemplate(
          candidate.applicant_name
        );
        subject = template.subject;
        bodyForCandidate = template.bodyForCandidate;
        bodyForInterviewer = template.bodyForInterviewer;
        method = "CANCEL";
      } else {
        throw new BadRequestException(
          "Status must be either 'rescheduled' or 'cancelled' to update the interview."
        );
      }

      const updatedField = {
        scheduledAt: payload.scheduledAt || existingInterview.scheduledAt,
        duration: payload.duration || existingInterview.duration,
        type: payload.type || existingInterview.type,
        interviewer: payload.interviewer || existingInterview.interviewer,
        location: payload.location || existingInterview.location,
        status: payload.status || existingInterview.status,
        notes: payload.notes || existingInterview.notes,
        eventId: existingInterview.eventId,
      };

      //send email to candidate and interviewer
      const email = await Promise.all([
        this.eventEmitter.emitAsync("interview.scheduled", {
          payload: {
            ...updatedField,
            candidateName: candidate.applicant_name,
            candidateEmail: candidate.applicant_email,
            method: method,
            sequence: sequence++,
            uId,
          },
          recipients: [candidate.applicant_email],
          subject,
          body: bodyForCandidate,
        }),
        this.eventEmitter.emitAsync("interview.scheduled", {
          payload: {
            ...updatedField,
            candidateName: candidate.applicant_name,
            candidateEmail: candidate.applicant_email,
            method: method,
            sequence: sequence++,
            uId,
          },
          recipients: [...updatedField.interviewer],
          subject,
          body: bodyForInterviewer,
        }),
      ]);
      if (!email?.length) {
        throw new BadRequestException("No listeners responded for email send");
      }
      const updatedInterview = await this.interviewRepository.update(
        id,
        payload
      );
      if (!updatedInterview) {
        throw new BadRequestException("Interview update failed");
      }

      return successResponse(
        "Interview updated successfully",
        updatedInterview
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while creating the Interview."
      );
    }
  }
}
