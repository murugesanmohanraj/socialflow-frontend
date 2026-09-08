import { ViewShell } from "./AccountsView";

const activityRows = [
  {
    date: "Today, 10:24 AM",
    account: "@maria.studio",
    platform: "TikTok",
    action: "Open content",
    status: "Success",
  },
  {
    date: "Today, 9:58 AM",
    account: "Growth Lab",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
  },
  {
    date: "Yesterday, 4:12 PM",
    account: "@northstar.co",
    platform: "TikTok",
    action: "Open content",
    status: "Failed",
  },
  {
    date: "Sep 07, 11:30 AM",
    account: "Creator Weekly",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
  },
];

function ActivityView() {
  return (
    <ViewShell
      eyebrow="Activity"
      title="Activity history"
      description="Review completed actions, failures, and account events."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#2f80ed]"
          defaultValue="All status"
        >
          <option>All status</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#2f80ed]"
          defaultValue="Last 7 days"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>All time</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_1.2fr_0.7fr] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">
          <span>Date</span>
          <span>Account</span>
          <span>Platform</span>
          <span>Action</span>
          <span>Status</span>
        </div>
        {activityRows.map((row) => (
          <div
            key={`${row.date}-${row.account}`}
            className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 md:grid-cols-[1.2fr_1fr_0.8fr_1.2fr_0.7fr] md:items-center md:gap-4 md:px-6"
          >
            <span className="text-xs text-slate-400">{row.date}</span>
            <span className="text-sm font-semibold text-[#102a43]">
              {row.account}
            </span>
            <span className="text-sm text-slate-500">{row.platform}</span>
            <span className="text-sm text-slate-500">{row.action}</span>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === "Success" ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff0f0] text-[#c24141]"}`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </ViewShell>
  );
}

export default ActivityView;
