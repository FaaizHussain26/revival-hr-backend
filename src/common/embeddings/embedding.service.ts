import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    this.client = new OpenAI({ apiKey: apiKey as string });
    this.model =
      this.configService.get<string>("EMBEDDING_MODEL") ||
      "text-embedding-3-small";
  }

  async generateEmbeddingFromJob(payload: {
    title: string;
    department: string;
    location: string;
    employment_type: string;
    experience_level: string;
    salary?: string;
    description: string;
    requirements: string;
    responsibilities: string;
    skills?: string[];
  }): Promise<number[] | undefined> {
    try {
      const composed = this.composeJobText(payload);
      if (!this.client.apiKey) {
        return undefined;
      }
      const res = await this.client.embeddings.create({
        model: this.model,
        input: composed,
      });
      return res.data?.[0]?.embedding as unknown as number[];
    } catch (error) {
      this.logger.error("Failed to generate embedding", error as Error);
      return undefined;
    }
  }
  private composeJobText(payload: {
    title: string;
    department: string;
    location: string;
    employment_type: string;
    experience_level: string;
    salary?: string;
    description: string;
    requirements: string;
    responsibilities: string;
    skills?: string[];
  }): string {
    const parts: string[] = [];
    parts.push(`Title: ${payload.title}`);
    parts.push(`Department: ${payload.department}`);
    parts.push(`Location: ${payload.location}`);
    parts.push(`Employment Type: ${payload.employment_type}`);
    parts.push(`Experience Level: ${payload.experience_level}`);
    if (payload.salary) parts.push(`Salary: ${payload.salary}`);
    parts.push(`Description: ${payload.description}`);
    parts.push(`Requirements: ${payload.requirements}`);
    parts.push(`Responsibilities: ${payload.responsibilities}`);
    if (payload.skills?.length)
      parts.push(`Skills: ${payload.skills.join(", ")}`);
    return parts.join("\n");
  }
}
