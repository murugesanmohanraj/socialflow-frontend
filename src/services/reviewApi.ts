import { apiRequest } from "./apiClient";

type ReviewItem = {
  accountId: string;
  accountName: string;
  status: "pending" | "opened" | "completed";
  openedAt?: string;
  completedAt?: string;
};

export type ReviewSession = {
  _id: string;
  targetUrl: string;
  items: ReviewItem[];
};

export function createYouTubeReview(targetUrl: string, accountIds: string[]) {
  return apiRequest<{ success: boolean; review: ReviewSession }>("/reviews", {
    method: "POST",
    body: { targetUrl, accountIds },
  });
}

export function getReview(reviewId: string) {
  return apiRequest<{ success: boolean; review: ReviewSession }>(
    `/reviews/${reviewId}`,
  );
}

export function updateReviewAccount(
  reviewId: string,
  accountId: string,
  status: "opened" | "completed",
) {
  return apiRequest<{ success: boolean; review: ReviewSession }>(
    `/reviews/${reviewId}/accounts/${accountId}`,
    { method: "PATCH", body: { status } },
  );
}
