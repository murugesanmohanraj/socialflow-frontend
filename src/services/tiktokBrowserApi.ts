import { apiRequest } from "./apiClient";

type TikTokBrowserResponse = {
  success: boolean;
  message: string;
  url: string;
  title: string;
  clickedLike?: boolean;
  postedComment?: boolean;
};

export function runTikTokAction(
  url: string,
  actionType: "like" | "comment" | "like_comment" | "watch",
  commentText?: string,
  accountId?: string,
) {
  return apiRequest<TikTokBrowserResponse>("/tiktok-browser/run", {
    method: "POST",
    body: { url, actionType, commentText, accountId },
  });
}

export function openTikTokPost(
  url: string,
  accountId?: string,
  actionType: "like" | "comment" | "like_comment" | "watch" = "like",
  commentText?: string,
) {
  return runTikTokAction(url, actionType, commentText, accountId);
}
