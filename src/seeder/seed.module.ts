import { Module } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/repositories/user.repository';

@Module({
  imports: [UsersModule],
  providers: [UserSeeder, UserRepository],
})
export class SeedModule {}
