import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserPaginationDto } from "../../common/pagination/dto/user-pagination.dto";
import {
  PaginateAndFilter,
  PaginationOutput,
} from "../../common/pagination/paginate-and-filter";
import { User } from "../entities/user.schema";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async findAllPaginatedAndFiltered(
    query: UserPaginationDto
  ): Promise<PaginationOutput<User>> {
    const filter: Record<string, any> = {
      deletedAt: null,
    };

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }
    query.filter = JSON.stringify(filter);

    return await PaginateAndFilter<User>(this.userModel, query, [
      "firstName",
      "lastName",
      "email",
    ]);
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }
  async findByEmail(userEmail: string): Promise<User | null> {
    return await this.userModel.findOne({ email: userEmail }).exec();
  }

  async countByFilter(filter?: Record<string, any>) {
    return await this.userModel.countDocuments(filter).exec();
  }
  async updateProfile(id: string, user: Partial<User>): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: user },
      { new: true }
    );
  }
  async update(id: string, update: Partial<User>): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id: string): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true }
    );
  }

  async restore(id: string): Promise<User | null> {
    return await this.userModel.findOneAndUpdate(
      { _id: id, deletedAt: { $ne: null } },
      { $set: { isActive: true, deletedAt: null } },
      { new: true }
    );
  }

  async permanentDelete(id: string): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
