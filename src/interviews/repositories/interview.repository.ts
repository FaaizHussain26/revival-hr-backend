import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateInterviewDto } from "../dto/create-interview.dto";
import { Interviews } from "../entities/interview.schema";
import { ShortlistedCandidates } from "src/shortlisted-candidate/entities/shortlisted-candidates.schema";
import { InterviewWithCandidate } from "src/common/utils/type/Interview-with-candidates.utils";
@Injectable()
export class InterviewRepository {
  constructor(
    @InjectModel(Interviews.name)
    private readonly InterviewModel: Model<Interviews>
  ) {}

  async create(payload: CreateInterviewDto): Promise<Interviews> {
    const create = new this.InterviewModel(payload);
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
}
