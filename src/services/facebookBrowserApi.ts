import { apiRequest } from "./apiClient";

type FacebookBrowserResponse = {
  success: boolean;
  message: string;
  url: string;
  title: string;
  clickedLike?: boolean;
  postedComment?: boolean;
};

export function runFacebookAction(
  url: string,
  actionType: "like" | "comment" | "like_comment",
  commentText?: string,
  accountId?: string,
) {
  return apiRequest<FacebookBrowserResponse>("/facebook-browser/run", {
    method: "POST",
    body: { url, actionType, commentText, accountId },
  });
}

export function openFacebookPost(
  url: string,
  accountId?: string,
  actionType: "like" | "comment" | "like_comment" = "like",
  commentText?: string,
) {
  return runFacebookAction(url, actionType, commentText, accountId);
}
