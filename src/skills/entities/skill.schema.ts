import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'skills' })
export class Skills extends Document {
  @Prop({ require: true })
  name: string;
}
export const SkillSchema = SchemaFactory.createForClass(Skills);
