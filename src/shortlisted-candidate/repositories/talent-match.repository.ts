import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import {
  PaginateAndFilter,
  PaginationOutput,
} from "src/common/pagination/paginate-and-filter";
import { Job } from "src/jobs/entities/job.schema";
import { CreateCandidateDto } from "../dto/create-shortlisted-candidates.dto";
import { UpdateCandidateStatusDto } from "../dto/update-candidate-status.dto";
import { TalentMatch } from "../entities/talent-match.schema";

@Injectable()
export class TalentMatchRepository {
  constructor(
    @InjectModel(TalentMatch.name)
    private readonly candidateModel: Model<TalentMatch>
  ) {}

  async aggregateCandidatesWithJobs() {
    return this.candidateModel.aggregate([
      {
        $group: {
          _id: "$match_details.job_id",
          count: { $sum: 1 },
          data: {
            // Push the full match_details blob for each candidate
            $push: "$match_details",
          },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  async aggregateCandidatesWithStatus() {
    return this.candidateModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          data: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);
  }

  /**
   * Mark candidates as duplicated if email is found more than once.
   */
  async markDuplicates() {
    const duplicates = await this.candidateModel.aggregate([
      {
        $group: {
          _id: "$match_details.outlook_details.applicant_email",
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    for (const dup of duplicates) {
      const [keepId, ...duplicateIds] = dup.ids;

      await this.candidateModel.updateMany(
        { _id: { $in: duplicateIds } },
        { $set: { isDuplicated: true } }
      );

      await this.candidateModel.updateOne(
        { _id: keepId },
        { $set: { isDuplicated: false } }
      );
    }

    return { message: "Duplicate emails marked as deleted." };
  }

  /**
   * Finds candidates with filter, sort, and limit, returns lean array.
   */
  async findSortedLimited(
    filter: Record<string, any> = {},
    sort: Record<string, any> = {},
    limit: number = 0
  ) {
    return await this.candidateModel
      .find(filter)
      .sort(sort)
      .limit(limit)
      .lean()
      .exec();
  }

  async findAllPaginatedAndFiltered(
    query: PaginationQueryDto
  ): Promise<PaginationOutput<TalentMatch>> {
    const result = await PaginateAndFilter<TalentMatch>(
      this.candidateModel,
      query,
      ["match_details.applicant_name"]
    );

    const populatedData = await this.candidateModel.populate(result.data, {
      path: "job",
      select: "-embedding",
    });

    result.data = populatedData;
    return result;
  }

  async count(
    fieldName?: string,
    fieldValue?: string,
    useRegex: boolean = false
  ) {
    const filter =
      fieldName && fieldValue
        ? {
            [fieldName]: useRegex
              ? new RegExp(`^${fieldValue}$`, "i")
              : fieldValue,
          }
        : {};
    return await this.candidateModel.countDocuments(filter).exec();
  }

  /**
   * Counts documents using a filter object (MongoDB style)
   */
  async countByFilter(filter: Record<string, any>) {
    return await this.candidateModel.countDocuments(filter).exec();
  }

  async create(payload: CreateCandidateDto): Promise<TalentMatch> {
    // Store all DTO fields inside match_details, to match MongoDB shape
    const newCandidate = new this.candidateModel({
      match_details: payload as any,
    });
    return await newCandidate.save();
  }

  async find() {
    return await this.candidateModel
      .find()
      .populate<{ job: Job }>("job")
      .exec();
  }

  async findByEmail(email: string): Promise<TalentMatch | null> {
    return await this.candidateModel
      .findOne({ "match_details.outlook_details.applicant_email": email })
      .exec();
  }

  async findById(id: string): Promise<TalentMatch | null> {
    return await this.candidateModel
      .findById(id)
      .populate({
        path: "job",
        select: "-embedding",
      })
      .lean()
      .exec();
  }

  async updateCandidateStatus(
    id: string,
    data: UpdateCandidateStatusDto
  ): Promise<TalentMatch | null> {
    return await this.candidateModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { status: (data as any).status } },
        { new: true }
      )
      .exec();
  }

  async delete(id: string): Promise<TalentMatch | null> {
    return await this.candidateModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { deletedAt: new Date() } },
        { new: true }
      )
      .exec();
  }

  async restore(id: string): Promise<TalentMatch | null> {
    return await this.candidateModel
      .findOneAndUpdate(
        { _id: id, deletedAt: { $ne: null } },
        { $set: { deletedAt: null } },
        { new: true }
      )
      .exec();
  }

  async permanentDelete(id: string): Promise<TalentMatch | null> {
    return await this.candidateModel.findByIdAndDelete(id);
  }
}
