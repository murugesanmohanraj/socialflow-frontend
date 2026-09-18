import { apiRequest } from "./apiClient";

export type DashboardSummary = {
  connectedAccounts: number;
  activeAccounts: number;
  activePlatforms: number;
  actionsToday: number;
  successfulToday: number;
  failedToday: number;
  completionRate: number;
  recentActivity: unknown[];
};

type DashboardResponse = {
  success: boolean;
  summary: DashboardSummary;
};

export function getDashboardSummary() {
  return apiRequest<DashboardResponse>("/dashboard/summary");
}
