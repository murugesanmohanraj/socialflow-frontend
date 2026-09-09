import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConnectAccountModal from "../Accounts/ConnectAccountModal";
import {
  getStoredAccounts,
  getStoredActivities,
} from "../../utils/socialflowStorage";
import AccountsView from "./AccountsView";
import ActionsView from "./ActionsView";
import ActivityView from "./ActivityView";
import DashboardSidebar from "./DashboardSidebar";
import SettingsView from "./SettingsView";

type DashboardOverviewProps = {
  onLogout: () => void;
};

function DashboardOverview({ onLogout }: DashboardOverviewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [accounts] = useState(getStoredAccounts);
  const [activities] = useState(getStoredActivities);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeView = location.pathname.slice(1) || "dashboard";

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <DashboardSidebar
          onLogout={onLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-[#102a43] shadow-sm"
            >
              ☰
            </button>
            <span className="text-sm font-semibold text-[#102a43]">
              Social Media Manager
            </span>
            <span className="h-11 w-11" />
          </div>
          {activeView === "dashboard" ? (
            <>
              <header className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                    Overview
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight text-[#102a43] sm:text-3xl">
                    Hello, Demo
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Here&apos;s what&apos;s happening across your social
                    workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:text-[#102a43] sm:block"
                >
                  Log out
                </button>
              </header>

              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Connected accounts"
                  value="10"
                  detail="2 platforms active"
                  accent="bg-[#eaf2fc] text-[#1976d2]"
                />
                <StatCard
                  label="Active accounts"
                  value="8"
                  detail="80% of your accounts"
                  accent="bg-[#e8f8f0] text-[#16845b]"
                />
                <StatCard
                  label="Actions today"
                  value="42"
                  detail="+18% from yesterday"
                  accent="bg-[#fff7e6] text-[#b45309]"
                />
                <StatCard
                  label="Successful"
                  value="38"
                  detail="90.5% completion rate"
                  accent="bg-[#f1eafe] text-[#7c3aed]"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[#102a43]">
                        Connected accounts
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Your latest account status
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/accounts")}
                      className="text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {accounts.map((account) => (
                      <div
                        key={account.name}
                        className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${account.color}`}
                          >
                            {account.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#102a43]">
                              {account.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {account.platform} · {account.lastActive}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${account.status === "Connected" ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff7e6] text-[#b45309]"}`}
                        >
                          {account.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[#102a43]">
                        Recent activity
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Latest workspace events
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/activity")}
                      className="text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-5">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f8f0] text-xs font-bold text-[#16845b]">
                          ✓
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#102a43]">
                            {activity.message}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {activity.account} · {activity.date}
                          </p>
                        </div>
                        <span
                          className={`self-start rounded-full px-2 py-1 text-[11px] font-semibold ${activity.status === "Success" ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff7e6] text-[#b45309]"}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-[#102a43] p-6 text-white sm:flex-row sm:items-center sm:p-8">
                <div>
                  <p className="text-lg font-semibold">
                    Ready to manage another account?
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Connect TikTok or YouTube and bring it into your workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(true)}
                  className="shrink-0 rounded-xl bg-[#57cc99] px-4 py-3 text-sm font-semibold text-[#102a43] hover:bg-[#8ee3bb]"
                >
                  Connect account
                </button>
              </section>
            </>
          ) : activeView === "accounts" ? (
            <AccountsView
              onConnectAccount={() => setIsConnectModalOpen(true)}
            />
          ) : activeView === "actions" ? (
            <ActionsView />
          ) : activeView === "activity" ? (
            <ActivityView />
          ) : (
            <SettingsView />
          )}
        </section>
      </div>
      {isConnectModalOpen && (
        <ConnectAccountModal onClose={() => setIsConnectModalOpen(false)} />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`h-3 w-3 rounded-full ${accent.split(" ")[0]}`} />
      </div>
      <p className="text-3xl font-semibold tracking-tight text-[#102a43]">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

export default DashboardOverview;
