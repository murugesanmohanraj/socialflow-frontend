import { StoredActivity, StoredPlatform } from "../utils/socialflowStorage";
import { apiRequest } from "./apiClient";

export type ApiActivity = {
  _id: string;
  accountName: string;
  platform: "tiktok" | "youtube" | "facebook" | "instagram";
  action: string;
  targetUrl: string;
  status: "success" | "failed";
  message: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
};

function mapActivity(activity: ApiActivity): StoredActivity {
  const platform: StoredPlatform =
    activity.platform === "tiktok"
      ? "TikTok"
      : activity.platform === "instagram"
        ? "Instagram"
        : activity.platform === "facebook"
          ? "Facebook"
          : "YouTube";
  return {
    id: activity._id,
    date: new Date(activity.completedAt).toLocaleString(),
    account: activity.accountName,
    platform,
    action: activity.action,
    status: activity.status === "success" ? "Success" : "Failed",
    target: activity.targetUrl,
    duration: `${Math.max(1, Math.round(activity.durationMs / 1000))}s`,
    message: activity.message,
  };
}

type ActivityResponse = { success: boolean; activity: ApiActivity };
type ActivitiesResponse = { success: boolean; activities: ApiActivity[] };

export async function getActivities(status?: "success" | "failed") {
  const query = status ? `?status=${status}` : "";
  const response = await apiRequest<ActivitiesResponse>(`/activity${query}`);
  return response.activities.map(mapActivity);
}

export async function getActivity(activityId: string) {
  const response = await apiRequest<ActivityResponse>(
    `/activity/${activityId}`,
  );
  return mapActivity(response.activity);
}
