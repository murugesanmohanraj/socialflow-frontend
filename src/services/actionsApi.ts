import { StoredAction, StoredPlatform } from "../utils/socialflowStorage";
import { apiRequest } from "./apiClient";

export type ApiAction = {
  _id: string;
  title: string;
  platform: "tiktok" | "youtube" | "facebook" | "instagram";
  actionType: string;
  targetUrl: string;
  accountIds: string[];
  repetitions: number;
  likeContent: boolean;
  postComment: boolean;
  commentText?: string;
  commentAssignments?: Array<{ accountId: string; commentText: string }>;
  createdAt: string;
};

type ActionResponse = { success: boolean; action: ApiAction };
type ActionsResponse = { success: boolean; actions: ApiAction[] };

function mapAction(action: ApiAction): StoredAction {
  const platform: StoredPlatform =
    action.platform === "tiktok"
      ? "TikTok"
      : action.platform === "youtube"
        ? "YouTube"
        : action.platform === "instagram"
          ? "Instagram"
          : "Facebook";
  return {
    id: action._id,
    title: action.title,
    platform,
    description: `Run ${action.actionType} for selected accounts.`,
    targetUrl: action.targetUrl,
    accountIds: action.accountIds,
    lastRun: "Not run yet",
    result: "Not run yet",
    repetitions: action.repetitions,
    likeContent: action.likeContent,
    postComment: action.postComment,
    commentText: action.commentText,
    commentAssignments: action.commentAssignments,
  };
}

export async function getActions() {
  const response = await apiRequest<ActionsResponse>("/actions");
  return response.actions.map(mapAction);
}

export async function getAction(actionId: string) {
  const response = await apiRequest<ActionResponse>(`/actions/${actionId}`);
  return mapAction(response.action);
}

export async function createAction(input: {
  title: string;
  platform: StoredPlatform;
  actionType: string;
  targetUrl: string;
  accountIds: string[];
  repetitions?: number;
  likeContent?: boolean;
  postComment?: boolean;
  commentText?: string;
  commentAssignments?: Array<{ accountId: string; commentText: string }>;
}) {
  const platformMap: Record<
    StoredPlatform,
    "tiktok" | "youtube" | "facebook" | "instagram"
  > = {
    TikTok: "tiktok",
    YouTube: "youtube",
    Facebook: "facebook",
    Instagram: "instagram",
  };
  const response = await apiRequest<ActionResponse>("/actions", {
    method: "POST",
    body: {
      ...input,
      platform: platformMap[input.platform],
    },
  });
  return mapAction(response.action);
}

export function deleteAction(actionId: string) {
  return apiRequest<{ success: boolean; message: string }>(
    `/actions/${actionId}`,
    {
      method: "DELETE",
    },
  );
}

export async function runAction(actionId: string) {
  return apiRequest<{
    success: boolean;
    execution: { _id: string; status: string };
  }>(`/actions/${actionId}/run`, { method: "POST" });
}

export function getExecution(executionId: string) {
  return apiRequest<{
    success: boolean;
    execution: {
      _id: string;
      actionId: string;
      status: string;
      targetUrl: string;
      items: Array<{
        accountId: string;
        accountName: string;
        status: string;
        message?: string;
        errorMessage?: string;
      }>;
    };
  }>(`/executions/${executionId}`);
}

export function getExecutionResults(executionId: string) {
  return apiRequest<{
    success: boolean;
    execution: {
      _id: string;
      actionId: string;
      status: string;
      targetUrl: string;
      items: Array<{
        accountId: string;
        accountName: string;
        status: string;
        message?: string;
        errorMessage?: string;
      }>;
    };
    summary: { total: number; successful: number; failed: number };
  }>(`/executions/${executionId}/results`);
}
