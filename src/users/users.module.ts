import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserService } from "./services/user.service";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { User, UserSchema } from "./entities/user.schema";
import { UserRepository } from "./repositories/user.repository";
import { AuthModule } from "../auth/auth.module";
import { RolesGuard } from "src/common/guards/role.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [MongooseModule],
})
export class UsersModule {}
