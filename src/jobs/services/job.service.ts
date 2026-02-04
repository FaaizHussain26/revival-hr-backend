import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { EmbeddingService } from "src/common/embeddings/embedding.service";
import { JobPaginationDto } from "src/common/pagination/dto/job-pagination.dto";
import {
  paginationResponse,
  successResponse,
} from "src/common/response/response";
import { CreateJobDto } from "../dto/create-job.dto";
import { UpdateJobDto } from "../dto/update-job.dto";
import { JobRepository } from "../repositories/job.repository";

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly embeddingService: EmbeddingService
  ) {}

  async create(createJobDto: CreateJobDto) {
    try {
      const existingJob = await this.jobRepository.findByName(
        createJobDto.title
      );
      if (existingJob) {
        throw new BadRequestException("Job with title already exists");
      }
      const embedding = await this.embeddingService.generateEmbeddingFromJob({
        title: createJobDto.title,
        department: createJobDto.department,
        location: createJobDto.location,
        employment_type: createJobDto.employment_type,
        experience_level: createJobDto.experience_level,
        salary: createJobDto.salary,
        description: createJobDto.description,
        requirements: createJobDto.requirements,
        responsibilities: createJobDto.responsibilities,
        skills: createJobDto.skills,
      });
      const createdJob = await this.jobRepository.create({
        ...createJobDto,
        ...(embedding ? { embedding } : {}),
      });
      if (!createdJob) {
        throw new BadRequestException("Job creation failed");
      }
      return successResponse("Job created successfully", createdJob);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while creating the job."
      );
    }
  }

  async findAll(query: JobPaginationDto) {
    const findAll = await this.jobRepository.findAllPaginatedAndFiltered(query);
    console.log("findAll", findAll);
    return paginationResponse(
      "Job retrieved successfully",
      findAll.data,
      findAll.total,
      findAll.current_page,
      findAll.last_page,
      findAll.per_page
    );
  }

  async findById(id: string) {
    try {
      const job = await this.jobRepository.findById(id);
      if (!job) {
        throw new NotFoundException("job not found");
      }
      return successResponse("Job retrieved successfully", job);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while retrieving the job."
      );
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    try {
      const existingJob = await this.jobRepository.findById(id);
      if (!existingJob) {
        throw new NotFoundException("Job not found");
      }

      if (updateJobDto.title && updateJobDto.title !== existingJob.title) {
        const userWithTitle = await this.jobRepository.findByName(
          updateJobDto.title
        );
        if (userWithTitle) {
          throw new BadRequestException("Job with title already exists");
        }
      }

      const embedding = await this.embeddingService.generateEmbeddingFromJob({
        title: updateJobDto.title ?? "",
        department: updateJobDto.department ?? "",
        location: updateJobDto.location ?? "",
        employment_type: updateJobDto.employment_type ?? "",
        experience_level: updateJobDto.experience_level ?? "",
        salary: updateJobDto.salary ?? "",
        description: updateJobDto.description ?? "",
        requirements: updateJobDto.requirements ?? "",
        responsibilities: updateJobDto.responsibilities ?? "",
        skills: updateJobDto.skills ?? [],
      });
      const updatedJob = await this.jobRepository.update(id, {
        ...updateJobDto,
        ...(embedding ? { embedding } : {}),
      });
      if (!updatedJob) {
        throw new BadRequestException("Job update failed");
      }
      return successResponse("User updated successfully", updatedJob);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while updating the job."
      );
    }
  }

  async delete(id: string) {
    try {
      const job = await this.jobRepository.findById(id);
      if (!job) {
        throw new NotFoundException("Job not found");
      }
      if (job.deletedAt !== null) {
        throw new BadRequestException("Job is already deleted");
      }
      const deletedJob = await this.jobRepository.delete(id);
      if (!deletedJob) {
        throw new BadRequestException("Job deletion failed");
      }
      return successResponse("Job deleted successfully", deletedJob);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while deleting the Job."
      );
    }
  }

  async restore(id: string) {
    try {
      const job = await this.jobRepository.findById(id);
      if (!job) {
        throw new NotFoundException("Job not found");
      }
      if (job.deletedAt == null) {
        throw new BadRequestException("Job is not deleted");
      }
      const jobRestored = await this.jobRepository.restore(id);
      if (!jobRestored) {
        throw new BadRequestException("Job restoration failed");
      }
      return successResponse("Job restored successfully", jobRestored);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while restoring the job."
      );
    }
  }

  async permanentDelete(id: string) {
    try {
      const job = await this.jobRepository.findById(id);
      if (!job) {
        throw new NotFoundException("Job not found");
      }
      if (job.deletedAt == null) {
        throw new BadRequestException("Job is not deleted");
      }
      const deletedJob = await this.jobRepository.permanentDelete(id);
      if (!deletedJob) {
        throw new BadRequestException("Job permanent deletion failed");
      }
      return successResponse(
        "Job permanently deleted successfully",
        deletedJob
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while permanently deleting the job."
      );
    }
  }
}
