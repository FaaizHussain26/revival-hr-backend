import { PartialType } from "@nestjs/swagger";
import { CreateCandidateDto } from "./create-shortlisted-candidates.dto";

export class UpdateCandidatesDto extends PartialType(CreateCandidateDto) {}
