import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "./ResourceStates";
import { ViewShell } from "./AccountsView";
import { getActivities } from "../../services/activityApi";

function ActivityView() {
  const [rows, setRows] = useState<Awaited<
    ReturnType<typeof getActivities>
  > | null>(null);
  const [statusFilter, setStatusFilter] = useState("All status");
  const [hasError, setHasError] = useState(false);

  const loadActivity = useCallback(() => {
    setHasError(false);
    setRows(null);
    getActivities(
      statusFilter === "Success"
        ? "success"
        : statusFilter === "Failed"
          ? "failed"
          : undefined,
    )
      .then(setRows)
      .catch(() => setHasError(true));
  }, [statusFilter]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const filteredRows = rows?.filter(
    (row) => statusFilter === "All status" || row.status === statusFilter,
  );

  return (
    <ViewShell
      eyebrow="Activity"
      title="Activity history"
      description="Review completed actions, failures, and account events."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#2f80ed]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
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
      {hasError ? (
        <ErrorState onRetry={loadActivity} />
      ) : rows === null ? (
        <LoadingState label="Loading activity..." />
      ) : filteredRows?.length === 0 ? (
        <EmptyState
          title="No activity found"
          description="There are no events matching the selected filters."
          action={{
            label: "Clear status filter",
            onClick: () => setStatusFilter("All status"),
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_1.2fr_0.7fr] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">
            <span>Date</span>
            <span>Account</span>
            <span>Platform</span>
            <span>Action</span>
            <span>Status</span>
          </div>
          {filteredRows?.map((row) => (
            <Link
              to={`/activity/${row.id}`}
              key={`${row.date}-${row.account}`}
              className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 hover:bg-slate-50 md:grid-cols-[1.2fr_1fr_0.8fr_1.2fr_0.7fr] md:items-center md:gap-4 md:px-6"
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
            </Link>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

export default ActivityView;
