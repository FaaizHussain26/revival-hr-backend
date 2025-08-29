import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateInterviewDto } from "../dto/create-interview.dto";
import { Interviews } from "../entities/interview.schema";
import { ShortlistedCandidates } from "src/shortlisted-candidate/entities/shortlisted-candidates.schema";
import { InterviewWithCandidate } from "src/common/utils/type/Interview-with-candidates.utils";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import {
  PaginateAndFilter,
  PaginationOutput,
} from "src/common/pagination/paginate-and-filter";
import { UpdateInterviewDto } from "../dto/update-interview.dto";
@Injectable()
export class InterviewRepository {
  constructor(
    @InjectModel(Interviews.name)
    private readonly InterviewModel: Model<Interviews>
  ) {}

  async create(
    payload: CreateInterviewDto,
    eventId: string
  ): Promise<Interviews> {
    const create = new this.InterviewModel({ ...payload, eventId });
    return await create.save();
  }

  async findByCandidate(candidateId: string): Promise<Interviews | null> {
    return this.InterviewModel.findOne({ candidate: candidateId }).exec();
  }
  async findAll(): Promise<InterviewWithCandidate[]> {
    const results = await this.InterviewModel.find()
      .populate<{ candidate: ShortlistedCandidates }>("candidate")
      .lean()
      .exec();
    return results;
  }

  async findAllPaginatedAndFiltered(
    query: PaginationQueryDto
  ): Promise<PaginationOutput<Interviews>> {
    query.filter = JSON.stringify({
      scheduledAt: { $gte: new Date().toISOString() },
    });
    const result = await PaginateAndFilter<Interviews>(
      this.InterviewModel,
      query,
      ["candidate"]
    );

    const populatedData = await this.InterviewModel.populate(result.data, {
      path: "candidate",
      select: "applicant_name applicant_email applicant_phone",
    });

    result.data = populatedData;
    return result;
  }

  async findById(id: string): Promise<Interviews | null> {
    return this.InterviewModel.findById(id)
      .populate({ path: "candidate" })
      .lean()
      .exec();
  }

  async findByDate(): Promise<Interviews[] | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    return this.InterviewModel.find({
      scheduledAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({ path: "candidate" })
      .lean()
      .exec();
  }

  async update(
    id: string,
    payload: UpdateInterviewDto
  ): Promise<Interviews | null> {
    return this.InterviewModel.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true }
    ).exec();
  }
}
