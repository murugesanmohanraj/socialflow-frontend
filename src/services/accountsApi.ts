import { StoredAccount, StoredPlatform } from "../utils/socialflowStorage";
import { apiRequest } from "./apiClient";

export type ApiSocialAccount = {
  _id: string;
  platform: "tiktok" | "youtube" | "facebook" | "instagram";
  accountName: string;
  username?: string;
  email?: string;
  status: "connected" | "needs_attention" | "disconnected";
  lastActivityAt?: string;
  createdAt: string;
};

type AccountsResponse = {
  success: boolean;
  accounts: ApiSocialAccount[];
};

function toStoredAccount(account: ApiSocialAccount): StoredAccount {
  const platform: StoredPlatform =
    account.platform === "tiktok"
      ? "TikTok"
      : account.platform === "facebook"
        ? "Facebook"
        : account.platform === "instagram"
          ? "Instagram"
          : "YouTube";
  const displayName =
    account.username ||
    account.accountName ||
    account.email ||
    "Facebook account";
  const initials =
    displayName
      .replace(/^@/, "")
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SM";

  return {
    id: account._id,
    name: displayName,
    platform,
    status: account.status === "connected" ? "Connected" : "Needs attention",
    lastActive: account.lastActivityAt
      ? new Date(account.lastActivityAt).toLocaleString()
      : "Not yet active",
    initials,
    color:
      platform === "TikTok"
        ? "bg-[#e9d5ff] text-[#6b21a8]"
        : platform === "Facebook"
          ? "bg-[#dbeafe] text-[#1d4ed8]"
          : platform === "Instagram"
            ? "bg-[#fce7f3] text-[#be185d]"
            : "bg-[#bfdbfe] text-[#1d4ed8]",
    connected: new Date(account.createdAt).toLocaleDateString(),
  };
}

export async function getAccounts() {
  const response = await apiRequest<AccountsResponse>("/accounts");
  return response.accounts.map(toStoredAccount);
}

export function connectFacebookAccount(email: string, password: string) {
  return apiRequest<{ success: boolean; account: ApiSocialAccount }>(
    "/accounts/facebook",
    {
      method: "POST",
      body: { email, password },
    },
  );
}

export function connectTikTokAccount(email: string, password: string) {
  return apiRequest<{ success: boolean; account: ApiSocialAccount }>(
    "/accounts/tiktok",
    {
      method: "POST",
      body: { email, password },
    },
  );
}

export function connectInstagramAccount(email: string, password: string) {
  return apiRequest<{ success: boolean; account: ApiSocialAccount }>(
    "/accounts/instagram",
    {
      method: "POST",
      body: { email, password },
    },
  );
}

export async function getAccount(accountId: string) {
  const response = await apiRequest<{
    success: boolean;
    account: ApiSocialAccount;
  }>(`/accounts/${accountId}`);
  return toStoredAccount(response.account);
}

export function disconnectAccount(accountId: string) {
  return apiRequest<{ success: boolean; account: ApiSocialAccount }>(
    `/accounts/${accountId}`,
    { method: "DELETE" },
  );
}
