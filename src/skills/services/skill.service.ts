import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateSkillDto } from "../dto/create-skill.dto";
import { UpdateSkillDto } from "../dto/update-skill.dto";
import { SkillRepository } from "../repositories/skill.repository";
import { successResponse } from "src/common/response/response";

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async create(payload: CreateSkillDto) {
    try {
      if (!payload.name) {
        throw new NotFoundException(`Skill name is required`);
      }
      const lowercaseName = payload.name.toLowerCase().trim();
      payload.name = lowercaseName;
      const duplicate = await this.skillRepository.findByName(payload.name);
      if (duplicate) {
        throw new ConflictException("Skill already exist");
      }
      const skill = await this.skillRepository.create(payload);
      if (!skill) {
        throw new BadRequestException("Skill creation failed");
      }
      return successResponse("Skill created successfully", skill);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while creating the skill."
      );
    }
  }

  async findAll(search?: string) {
    const skills = await this.skillRepository.findAll({ search });
    return successResponse("Skill retrieved successfully", skills);
  }

  async findById(id: string) {
    try {
      if (!id) {
        throw new NotFoundException("Skill ID is required");
      }
      const skill = await this.skillRepository.findById(id);
      if (!skill) {
        throw new NotFoundException(`Skill not found`);
      }
      return successResponse("Skill retrieved successfully", skill);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while retrieving the skill."
      );
    }
  }

  async update(id: string, payload: UpdateSkillDto) {
    try {
      if (!payload.name) {
        throw new NotFoundException(`Skill name is required`);
      }
      const lowercaseName = payload.name.toLowerCase().trim();
      payload.name = lowercaseName;
      const duplicate = await this.skillRepository.findByName(payload.name);
      if (duplicate) {
        throw new ConflictException("Skill already exist");
      }
      const updatedSkill = await this.skillRepository.update(id, payload);
      if (!updatedSkill) {
        return new BadRequestException("Skill update failed");
      }
      return successResponse("Skill updated successfully", updatedSkill);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "An unexpected error occurred while updating the skill."
      );
    }
  }

  async delete(id: string) {
    try {
      const skill = await this.skillRepository.findById(id);
      if (!skill) {
        throw new NotFoundException("Skill not found");
      }
      const deletedSkill = await this.skillRepository.delete(id);
      if (!deletedSkill) {
        throw new BadRequestException("Skill permanent deletion failed");
      }
      return successResponse(
        "Skill permanently deleted successfully",
        deletedSkill
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong while permanently deleting the skill."
      );
    }
  }
}
