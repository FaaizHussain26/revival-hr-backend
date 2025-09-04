import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "../services/dashboard.service";
import { ApiTags } from "@nestjs/swagger";


@Controller("dashboard")
@ApiTags("Dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  async getDashboardStats(): Promise<any> {
    return this.dashboardService.getDashboardStats();
  }
}
