import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  location: string;

  @Prop({
    required: true,
    enum: ["full-time", "part-time", "contract", "intern"],
  })
  employment_type: "full-time" | "part-time" | "contract" | "intern";

  @Prop({
    required: true,
    enum: ["entry level", "mid level", "senior level", "executive"],
  })
  experience_level: "entry level" | "mid level" | "senior level" | "executive";

  @Prop()
  salary: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ required: true })
  responsibilities: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  deletedAt: Date;

  // Numeric vector embedding of the job content for vector search
  @Prop({ type: [Number], default: [] })
  embedding?: number[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
