import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type InterviewDocument = Interviews & Document;

@Schema({ timestamps: true, collection: "interviews" })
export class Interviews {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShortlistedCandidates",
    required: false,
  })
  candidate: mongoose.Types.ObjectId;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ required: true, default: 60 })
  duration: number;

  @Prop({
    required: true,
    enum: ["hr", "clinical", "administration/leadership "],
  })
  type: string;

  @Prop({ required: true, type: [String] })
  interviewer: string[];

  @Prop({ required: true })
  location: string;

  @Prop({
    required: true,
    enum: ["scheduled", "completed", "cancelled", "rescheduled"],
    default: "scheduled",
  })
  status: string;

  @Prop()
  notes?: string;

  @Prop()
  eventId?: string;
}

export const InterviewSchema = SchemaFactory.createForClass(Interviews);
