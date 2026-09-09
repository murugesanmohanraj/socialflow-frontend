import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

type AccountRecord = {
  id: string;
  name: string;
  platform: "TikTok" | "YouTube";
  status: "Connected" | "Needs attention";
  connected: string;
  lastActive: string;
  initials: string;
  color: string;
};

const accountRecords: Record<string, AccountRecord> = {
  "maria-studio": {
    id: "maria-studio",
    name: "@maria.studio",
    platform: "TikTok",
    status: "Connected",
    connected: "September 02, 2026",
    lastActive: "2 minutes ago",
    initials: "MS",
    color: "bg-[#e9d5ff] text-[#6b21a8]",
  },
  "growth-lab": {
    id: "growth-lab",
    name: "Growth Lab",
    platform: "YouTube",
    status: "Connected",
    connected: "August 28, 2026",
    lastActive: "12 minutes ago",
    initials: "GL",
    color: "bg-[#bfdbfe] text-[#1d4ed8]",
  },
  "northstar-co": {
    id: "northstar-co",
    name: "@northstar.co",
    platform: "TikTok",
    status: "Needs attention",
    connected: "August 16, 2026",
    lastActive: "Yesterday",
    initials: "NC",
    color: "bg-[#fed7aa] text-[#c2410c]",
  },
  "creator-weekly": {
    id: "creator-weekly",
    name: "Creator Weekly",
    platform: "YouTube",
    status: "Connected",
    connected: "August 08, 2026",
    lastActive: "Monday",
    initials: "CW",
    color: "bg-[#d8f5e7] text-[#16845b]",
  },
};

const recentActivity = [
  { action: "Open content", status: "Success", time: "Today, 10:24 AM" },
  { action: "Open content", status: "Success", time: "Today, 9:48 AM" },
  {
    action: "Account authorization refreshed",
    status: "Success",
    time: "Yesterday, 4:12 PM",
  },
];

function AccountDetailsView({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [isDisconnectConfirmOpen, setIsDisconnectConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const account = accountId ? accountRecords[accountId] : undefined;

  if (!account || isDisconnected) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#102a43]">
            Account not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This account is no longer available in your workspace.
          </p>
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="mt-5 rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white"
          >
            Back to accounts
          </button>
        </div>
      </main>
    );
  }

  const isAttentionRequired = account.status === "Needs attention";

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <DashboardSidebar
          onLogout={onLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <section className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
          <div className="mb-5 flex items-center justify-between md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-[#102a43] shadow-sm"
            >
              ☰
            </button>
            <span className="text-sm font-semibold text-[#102a43]">
              Account details
            </span>
            <span className="h-10 w-10" />
          </div>
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="mb-6 text-sm font-semibold text-[#1976d2] hover:text-[#102a43] sm:mb-8"
          >
            ← Back to accounts
          </button>
          <header className="mb-6 flex flex-col justify-between gap-5 sm:mb-8 sm:flex-row sm:items-start">
            <div className="flex items-center gap-4">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${account.color}`}
              >
                {account.initials}
              </span>
              <div className="min-w-0">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                  {account.platform}
                </p>
                <h1 className="break-words text-2xl font-semibold tracking-tight text-[#102a43] sm:text-3xl">
                  {account.name}
                </h1>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isAttentionRequired ? "bg-[#fff7e6] text-[#b45309]" : "bg-[#e8f8f0] text-[#16845b]"}`}
                >
                  {account.status}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(`/connect/${account.platform.toLowerCase()}`)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-[#102a43] shadow-sm hover:border-[#2f80ed] hover:text-[#1976d2] sm:w-auto"
            >
              {isAttentionRequired ? "Reconnect account" : "Manage connection"}
            </button>
          </header>
          {isAttentionRequired && (
            <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#f5d99a] bg-[#fffaf0] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-[#92400e]">
                  Connection needs attention
                </p>
                <p className="mt-1 text-sm text-[#a16207]">
                  Authorization may have expired. Reconnect to resume supported
                  actions.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigate(`/connect/${account.platform.toLowerCase()}`)
                }
                className="rounded-xl bg-[#b45309] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#92400e]"
              >
                Reconnect
              </button>
            </div>
          )}
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#102a43]">
                Account information
              </h2>
              <div className="mt-6 space-y-5">
                <InfoRow label="Username / channel" value={account.name} />
                <InfoRow label="Platform" value={account.platform} />
                <InfoRow label="Connected" value={account.connected} />
                <InfoRow label="Last activity" value={account.lastActive} />
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#102a43]">
                    Available actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Supported actions for this platform
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/actions")}
                  className="text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
                >
                  View actions
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ActionOption
                  label="Open content"
                  enabled={!isAttentionRequired}
                />
                <ActionOption label="Review activity" enabled />
                <ActionOption
                  label="Run workflow"
                  enabled={!isAttentionRequired}
                />
              </div>
            </section>
          </div>
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#102a43]">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Latest actions for this account
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/activity")}
                className="self-start text-sm font-semibold text-[#1976d2] hover:text-[#102a43] sm:self-auto"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <div
                  key={`${item.action}-${item.time}`}
                  className="flex flex-col justify-between gap-2 py-4 first:pt-0 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#102a43]">
                      {item.action}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                  <span className="w-fit rounded-full bg-[#e8f8f0] px-2.5 py-1 text-xs font-semibold text-[#16845b]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-6 flex justify-start sm:justify-end">
            <button
              type="button"
              onClick={() => setIsDisconnectConfirmOpen(true)}
              className="text-sm font-semibold text-[#c24141] hover:text-[#991b1b]"
            >
              Disconnect account
            </button>
          </div>
        </section>
        {isDisconnectConfirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 px-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="disconnect-title"
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2
                id="disconnect-title"
                className="text-lg font-semibold text-[#102a43]"
              >
                Disconnect this account?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Supported actions will stop running for {account.name}. You can
                reconnect it later.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsDisconnectConfirmOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDisconnectConfirmOpen(false);
                    setIsDisconnected(true);
                  }}
                  className="rounded-xl bg-[#c24141] px-4 py-3 text-sm font-semibold text-white hover:bg-[#991b1b]"
                >
                  Disconnect account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-[#102a43] sm:text-right">
        {value}
      </span>
    </div>
  );
}
function ActionOption({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${enabled ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"}`}
    >
      <span className="text-sm font-semibold text-[#102a43]">{label}</span>
      <span
        className={`text-xs font-semibold ${enabled ? "text-[#16845b]" : "text-slate-400"}`}
      >
        {enabled ? "Available" : "Reconnect"}
      </span>
    </div>
  );
}

export default AccountDetailsView;
