import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "talent_match" })
export class TalentMatch extends Document {
  /**
   * All matching details are stored under this object in MongoDB.
   * Example (from your data):
   * {
   *   applicant_id,
   *   applicant_name,
   *   applicant_summary,
   *   outlook_details: { applicant_email, applicant_phone, job_matched, summary_match },
   *   applicant_skills: [...],
   *   matched_skills: [...],
   *   experience: {...},
   *   bonus_matches: [...],
   *   match_score,
   *   jobs_matched: [...],
   *   cv_details,
   *   job_applied_for,
   *   job_id,
   *   job_title,
   *   isDuplicated
   * }
   */
  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  match_details: Record<string, any>;

  @Prop({ default: false })
  isDuplicated: boolean;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: () => Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TalentMatchSchema = SchemaFactory.createForClass(TalentMatch);
