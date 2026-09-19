import { apiRequest } from "./apiClient";

type InstagramBrowserResponse = {
  success: boolean;
  message: string;
  results: Array<{
    accountId: string;
    accountName: string;
    url: string;
    title: string;
    message: string;
    success: boolean;
    clickedLike?: boolean;
    postedComment?: boolean;
    verificationRequired?: boolean;
  }>;
};

export function runInstagramAction(
  url: string,
  actionType: "like" | "comment" | "like_comment",
  commentText?: string,
  accountIds?: string[],
  commentAssignments?: Array<{ accountId: string; commentText: string }>,
) {
  return apiRequest<InstagramBrowserResponse>("/instagram-browser/run", {
    method: "POST",
    body: { url, actionType, commentText, accountIds, commentAssignments },
  });
}

export function requestInstagramVerificationCode(accountId: string) {
  return apiRequest<{ success: boolean; message: string }>(
    "/instagram-browser/new-code",
    {
      method: "POST",
      body: { accountId },
    },
  );
}

export function submitInstagramVerificationCode(
  accountId: string,
  code: string,
) {
  return apiRequest<{
    success: boolean;
    message: string;
    verificationRequired: boolean;
  }>("/instagram-browser/verify", {
    method: "POST",
    body: { accountId, code },
  });
}

export function openInstagramPost(
  url: string,
  accountIds?: string[],
  actionType: "like" | "comment" | "like_comment" = "like",
  commentText?: string,
  commentAssignments?: Array<{ accountId: string; commentText: string }>,
) {
  return runInstagramAction(
    url,
    actionType,
    commentText,
    accountIds,
    commentAssignments,
  );
}
