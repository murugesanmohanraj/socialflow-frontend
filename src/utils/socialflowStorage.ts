export type StoredPlatform = "TikTok" | "YouTube" | "Facebook" | "Instagram";

export type StoredAccount = {
  id: string;
  name: string;
  platform: StoredPlatform;
  status: "Connected" | "Needs attention";
  lastActive: string;
  initials: string;
  color: string;
  connected: string;
};

export type StoredAction = {
  id: string;
  title: string;
  platform: StoredPlatform;
  description: string;
  targetUrl: string;
  accountIds: string[];
  lastRun: string;
  result: string;
  repetitions?: number;
  likeContent?: boolean;
  postComment?: boolean;
  commentText?: string;
  commentAssignments?: Array<{ accountId: string; commentText: string }>;
};

export type StoredActivity = {
  id: string;
  date: string;
  account: string;
  platform: StoredPlatform;
  action: string;
  status: "Success" | "Failed";
  target: string;
  duration: string;
  message: string;
};
