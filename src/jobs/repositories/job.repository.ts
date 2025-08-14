import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "../entities/job.schema";
import { CreateJobDto } from "../dto/create-job.dto";
import { UpdateJobDto } from "../dto/update-job.dto";
import {
  PaginateAndFilter,
  PaginationOutput,
} from "src/common/pagination/paginate-and-filter";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { JobPaginationDto } from "src/common/pagination/dto/job-pagination.dto";

@Injectable()
export class JobRepository {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {}

  async create(
    createJobDto: CreateJobDto & { embedding?: number[] }
  ): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  async findAllPaginatedAndFiltered(
    query: JobPaginationDto
  ): Promise<PaginationOutput<Job>> {
    const filter: Record<string, any> = {
      deletedAt: null,
    };
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
      query.filter = JSON.stringify(filter);
    }
    const result = await PaginateAndFilter<Job>(this.jobModel, query, [
      "title",
    ]);
    return result;
  }

  async getById(id: string): Promise<Job | null> {
    return this.jobModel.findById(id).exec();
  }

  async getByName(title: string): Promise<Job | null> {
    return await this.jobModel.findOne({ title: title }).exec();
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto & { embedding?: number[] }
  ): Promise<Job | null> {
    return this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Job | null> {
    return await this.jobModel.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true }
    );
  }

  async restore(id: string): Promise<Job | null> {
    return await this.jobModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { isActive: true, deletedAt: null } },
      { new: true }
    );
  }

  async permanentDelete(id: string): Promise<Job | null> {
    return await this.jobModel.findByIdAndDelete(id);
  }
}
