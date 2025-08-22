import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { UserPaginationDto } from "src/common/pagination/dto/user-pagination.dto";
import {
  paginationResponse,
  successResponse,
} from "src/common/response/response";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userrepo: UserRepository) {}

  async findAll(query: UserPaginationDto) {
    const findAll = await this.userrepo.findAllPaginatedAndFiltered(query);
    return paginationResponse(
      "Users retrieved successfully",
      findAll.data,
      findAll.total,
      findAll.current_page,
      findAll.last_page,
      findAll.per_page
    );
  }

  async findById(id: string) {
    try {
      const user = await this.userrepo.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return successResponse("User retrieved successfully", user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while retrieving the user."
      );
    }
  }

  async create(payload: CreateUserDto) {
    try {
      const existingUser = await this.userrepo.findByEmail(payload.email);
      if (existingUser) {
        throw new BadRequestException("Email already exists");
      }
      const user = await this.userrepo.create(payload);
      if (!user) {
        throw new BadRequestException("User creation failed");
      }
      return successResponse("User created successfully", user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while creating the user."
      );
    }
  }

  async update(id: string, payload: UpdateUserDto) {
    try {
      const existingUser = await this.userrepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException("User not found");
      }
      if (payload.email && payload.email !== existingUser.email) {
        const userWithEmail = await this.userrepo.findByEmail(payload.email);
        if (userWithEmail) {
          throw new BadRequestException("Email already exists");
        }
      }
      const updatedUser = await this.userrepo.update(id, payload);
      if (!updatedUser) {
        throw new BadRequestException("User update failed");
      }
      return successResponse("User updated successfully", updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while updating the user."
      );
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userrepo.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.deletedAt !== null) {
        throw new BadRequestException("User is already deleted");
      }
      const deletedUser = await this.userrepo.delete(id);
      if (!deletedUser) {
        throw new BadRequestException("User deletion failed");
      }
      return successResponse("User deleted successfully", deletedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while deleting the user."
      );
    }
  }

  async restore(id: string) {
    try {
      const user = await this.userrepo.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.deletedAt == null) {
        throw new BadRequestException("User is not deleted");
      }
      const userRestored = await this.userrepo.restore(id);
      if (!userRestored) {
        throw new BadRequestException("User restoration failed");
      }
      return successResponse("User restored successfully", userRestored);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while restoring the user."
      );
    }
  }

  async permanentDelete(id: string) {
    try {
      const user = await this.userrepo.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.deletedAt == null) {
        throw new BadRequestException("User is not deleted");
      }
      const deletedUser = await this.userrepo.permanentDelete(id);
      if (!deletedUser) {
        throw new BadRequestException("User permanent deletion failed");
      }
      return successResponse(
        "User permanently deleted successfully",
        deletedUser
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while permanently deleting the user."
      );
    }
  }
}
