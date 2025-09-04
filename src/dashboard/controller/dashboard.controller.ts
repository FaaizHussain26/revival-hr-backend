import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Controller("dashboard")
@ApiTags("Dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  async getDashboardStats(): Promise<any> {
    return this.dashboardService.getDashboardStats();
  }
}
