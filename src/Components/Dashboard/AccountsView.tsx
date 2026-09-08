import { useState } from "react";

const connectedAccounts = [
  {
    name: "@maria.studio",
    platform: "TikTok",
    status: "Connected",
    lastActive: "2 min ago",
    initials: "MS",
    color: "bg-[#e9d5ff] text-[#6b21a8]",
  },
  {
    name: "Growth Lab",
    platform: "YouTube",
    status: "Connected",
    lastActive: "12 min ago",
    initials: "GL",
    color: "bg-[#bfdbfe] text-[#1d4ed8]",
  },
  {
    name: "@northstar.co",
    platform: "TikTok",
    status: "Needs attention",
    lastActive: "Yesterday",
    initials: "NC",
    color: "bg-[#fed7aa] text-[#c2410c]",
  },
  {
    name: "Creator Weekly",
    platform: "YouTube",
    status: "Connected",
    lastActive: "Monday",
    initials: "CW",
    color: "bg-[#d8f5e7] text-[#16845b]",
  },
];

function AccountsView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "TikTok", "YouTube"];
  const filteredAccounts =
    filter === "All"
      ? connectedAccounts
      : connectedAccounts.filter((account) => account.platform === filter);

  return (
    <ViewShell
      eyebrow="Accounts"
      title="Connected accounts"
      description="Manage your TikTok and YouTube accounts from one place."
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2 rounded-xl bg-slate-200/70 p-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === item ? "bg-white text-[#102a43] shadow-sm" : "text-slate-500 hover:text-[#102a43]"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          + Connect account
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">
          <span>Account</span>
          <span>Platform</span>
          <span>Status</span>
          <span>Last active</span>
          <span />
        </div>
        {filteredAccounts.map((account) => (
          <div
            key={account.name}
            className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center md:px-6"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${account.color}`}
              >
                {account.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#102a43]">
                  {account.name}
                </p>
                <p className="mt-1 text-xs text-slate-400 md:hidden">
                  {account.platform} · {account.lastActive}
                </p>
              </div>
            </div>
            <span className="hidden text-sm text-slate-500 md:block">
              {account.platform}
            </span>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${account.status === "Connected" ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff7e6] text-[#b45309]"}`}
            >
              {account.status}
            </span>
            <span className="hidden text-sm text-slate-500 md:block">
              {account.lastActive}
            </span>
            <button
              type="button"
              aria-label={`Open ${account.name} menu`}
              className="hidden text-lg text-slate-400 hover:text-[#102a43] md:block"
            >
              •••
            </button>
          </div>
        ))}
      </div>
    </ViewShell>
  );
}

export function ViewShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#102a43]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </header>
      {children}
    </>
  );
}

export default AccountsView;
