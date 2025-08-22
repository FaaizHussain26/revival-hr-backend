import { Module } from '@nestjs/common';
import { Skills, SkillSchema } from './entities/skill.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillController } from './controller/skill.controller';
import { SkillService } from './services/skill.service';
import { SkillRepository } from './repositories/skill.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SkillController],
  imports: [
    MongooseModule.forFeature([{ name: Skills.name, schema: SkillSchema }]),
  ],

  providers: [SkillService, SkillRepository, JwtService],
})
export class SkillModule {}
