import { InjectModel } from "@nestjs/mongoose";
import { Skills } from "../entities/skill.schema";
import { DeleteResult, FilterQuery, Model } from "mongoose";
import { UpdateSkillDto } from "../dto/update-skill.dto";
import { Injectable } from "@nestjs/common";
import { CreateSkillDto } from "../dto/create-skill.dto";
@Injectable()
export class SkillRepository {
  constructor(
    @InjectModel(Skills.name)
    private readonly skillModel: Model<Skills>
  ) {}

  async create(payload: CreateSkillDto): Promise<Skills> {
    const create = new this.skillModel(payload);
    return await create.save();
  }

  async findAll(filter: { search?: string }): Promise<Skills[]> {
    const query: FilterQuery<Skills> = {};
    if (filter?.search) {
      query.name = { $regex: filter.search, $options: "i" };
    }
    return await this.skillModel.find(query).exec();
  }

  async findById(id: string): Promise<Skills | null> {
    return await this.skillModel.findById(id).exec();
  }
  async findByName(name: string): Promise<Skills | null> {
    return await this.skillModel.findOne({ name }).exec();
  }

  async update(id: string, update: Partial<Skills>): Promise<Skills | null> {
    return await this.skillModel
      .findOneAndUpdate({ _id: id }, { $set: update }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Skills | null> {
    return await this.skillModel.findByIdAndDelete(id);
  }
}
