import { apiRequest } from "./apiClient";

type InstagramBrowserResponse = {
  success: boolean;
  message: string;
  url: string;
  title: string;
  clickedLike?: boolean;
  postedComment?: boolean;
};

export function runInstagramAction(
  url: string,
  actionType: "like" | "comment" | "like_comment",
  commentText?: string,
  accountId?: string,
) {
  return apiRequest<InstagramBrowserResponse>("/instagram-browser/run", {
    method: "POST",
    body: { url, actionType, commentText, accountId },
  });
}

export function openInstagramPost(
  url: string,
  accountId?: string,
  actionType: "like" | "comment" | "like_comment" = "like",
  commentText?: string,
) {
  return runInstagramAction(url, actionType, commentText, accountId);
}
