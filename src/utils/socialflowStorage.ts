export type StoredPlatform = "TikTok" | "YouTube";

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

const ACCOUNTS_KEY = "socialflow_accounts";
const ACTIONS_KEY = "socialflow_actions";
const ACTIVITY_KEY = "socialflow_activity";

export const defaultAccounts: StoredAccount[] = [
  {
    id: "maria-studio",
    name: "@maria.studio",
    platform: "TikTok",
    status: "Connected",
    lastActive: "2 min ago",
    initials: "MS",
    color: "bg-[#e9d5ff] text-[#6b21a8]",
    connected: "September 02, 2026",
  },
  {
    id: "growth-lab",
    name: "Growth Lab",
    platform: "YouTube",
    status: "Connected",
    lastActive: "12 min ago",
    initials: "GL",
    color: "bg-[#bfdbfe] text-[#1d4ed8]",
    connected: "August 28, 2026",
  },
  {
    id: "northstar-co",
    name: "@northstar.co",
    platform: "TikTok",
    status: "Needs attention",
    lastActive: "Yesterday",
    initials: "NC",
    color: "bg-[#fed7aa] text-[#c2410c]",
    connected: "August 16, 2026",
  },
  {
    id: "creator-weekly",
    name: "Creator Weekly",
    platform: "YouTube",
    status: "Connected",
    lastActive: "Monday",
    initials: "CW",
    color: "bg-[#d8f5e7] text-[#16845b]",
    connected: "August 08, 2026",
  },
];

export const defaultActions: StoredAction[] = [
  {
    id: "open-content",
    title: "Open content",
    platform: "TikTok",
    description: "Open a supported TikTok content URL with selected accounts.",
    targetUrl: "https://www.tiktok.com/@creator/video/123456789",
    accountIds: ["maria-studio", "northstar-co"],
    lastRun: "8 minutes ago",
    result: "4 / 5 successful",
    repetitions: 1,
    likeContent: false,
    postComment: false,
  },
  {
    id: "review-channel-content",
    title: "Review channel content",
    platform: "YouTube",
    description: "Open and review a YouTube video from connected channels.",
    targetUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    accountIds: ["growth-lab", "creator-weekly"],
    lastRun: "Yesterday",
    result: "8 / 8 successful",
    repetitions: 1,
    likeContent: false,
    postComment: false,
  },
];

export const defaultActivities: StoredActivity[] = [
  {
    id: "maria-open-content",
    date: "Today, 10:24 AM",
    account: "@maria.studio",
    platform: "TikTok",
    action: "Open content",
    status: "Success",
    target: "https://www.tiktok.com/@creator/video/123456789",
    duration: "2m 14s",
    message: "Content opened successfully",
  },
  {
    id: "growth-review-content",
    date: "Today, 9:58 AM",
    account: "Growth Lab",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
    target: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "1m 42s",
    message: "Video opened successfully",
  },
  {
    id: "northstar-open-content",
    date: "Yesterday, 4:12 PM",
    account: "@northstar.co",
    platform: "TikTok",
    action: "Open content",
    status: "Failed",
    target: "https://www.tiktok.com/@creator/video/987654321",
    duration: "18s",
    message: "Authorization expired",
  },
  {
    id: "creator-review-content",
    date: "Sep 07, 11:30 AM",
    account: "Creator Weekly",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
    target: "https://www.youtube.com/watch?v=abc123",
    duration: "2m 03s",
    message: "Video opened successfully",
  },
];

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredAccounts() {
  return readStored(ACCOUNTS_KEY, defaultAccounts);
}

export function saveAccounts(accounts: StoredAccount[]) {
  writeStored(ACCOUNTS_KEY, accounts);
}

export function addStoredAccount(account: StoredAccount) {
  const accounts = getStoredAccounts();
  const withoutExisting = accounts.filter((item) => item.id !== account.id);
  saveAccounts([...withoutExisting, account]);
}

export function getStoredActions() {
  return readStored(ACTIONS_KEY, defaultActions);
}

export function getStoredAction(id?: string) {
  const actions = getStoredActions();
  return actions.find((action) => action.id === id) ?? actions[0];
}

export function getStoredAccount(id: string) {
  return getStoredAccounts().find((account) => account.id === id);
}

export function saveActions(actions: StoredAction[]) {
  writeStored(ACTIONS_KEY, actions);
}

export function addStoredAction(action: StoredAction) {
  saveActions([
    ...getStoredActions().filter((item) => item.id !== action.id),
    action,
  ]);
}

export function getStoredActivities() {
  return readStored(ACTIVITY_KEY, defaultActivities);
}

export function saveActivities(activities: StoredActivity[]) {
  writeStored(ACTIVITY_KEY, activities);
}

export function addStoredActivity(activity: StoredActivity) {
  saveActivities([
    activity,
    ...getStoredActivities().filter((item) => item.id !== activity.id),
  ]);
}

export function getStoredActivity(id?: string) {
  return getStoredActivities().find((activity) => activity.id === id);
}
