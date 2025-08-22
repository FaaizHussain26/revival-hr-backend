import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../users/repositories/user.repository";

@Injectable()
export class UserSeeder {
  constructor(private readonly userRepo: UserRepository) {}

  async seed() {
    // Check if admin exists
    const adminEmail = "admin@example.com";
    const admin = await this.userRepo.findByEmail(adminEmail);
    if (!admin) {
      await this.userRepo.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: await bcrypt.hash("adminpass", 10),
        isActive: true,
        role: "admin",
      });
    }
    // Seed regular users
    for (let i = 1; i <= 3; i++) {
      const email = `user${i}@example.com`;
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        await this.userRepo.create({
          firstName: `User${i}`,
          lastName: "Test",
          email,
          password: await bcrypt.hash("userpass", 10),
          isActive: true,
          role: "user",
        });
      }
    }
  }
}
