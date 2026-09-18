import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getActivity } from "../../services/activityApi";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import { ViewShell } from "../Dashboard/AccountsView";

function ActivityDetailsView() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const [activity, setActivity] = useState<Awaited<
    ReturnType<typeof getActivity>
  > | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function renderPage(content: React.ReactNode) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
        <div className="flex min-h-screen">
          <DashboardSidebar
            onLogout={() => undefined}
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
                Activity
              </span>
              <span className="h-11 w-11" />
            </div>
            {content}
          </section>
        </div>
      </main>
    );
  }

  useEffect(() => {
    if (!activityId) return;
    getActivity(activityId)
      .then(setActivity)
      .catch(() => setHasError(true));
  }, [activityId]);

  if (hasError)
    return renderPage(
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-[#102a43]">
          Activity not found
        </h1>
        <button
          type="button"
          onClick={() => navigate("/activity")}
          className="mt-5 rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white"
        >
          Back to activity
        </button>
      </div>,
    );

  if (!activity) {
    return renderPage(
      <div className="mx-auto w-full max-w-6xl text-center">
        <p className="text-sm text-slate-500">Loading activity...</p>
      </div>,
    );
  }

  const isSuccess = activity.status === "Success";
  return renderPage(
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Activity / Details"
        title="Activity details"
        description="Review the execution timeline and outcome for this activity."
      >
        <button
          type="button"
          onClick={() => navigate("/activity")}
          className="mb-8 text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
        >
          ← Back to activity
        </button>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                {activity.platform}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#102a43]">
                {activity.action}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {activity.account} · {activity.date}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${isSuccess ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff0f0] text-[#c24141]"}`}
            >
              {activity.status}
            </span>
          </div>
          <div className="mt-8 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-3">
            <DetailStat label="Account" value={activity.account} />
            <DetailStat label="Duration" value={activity.duration} />
            <DetailStat label="Result" value={activity.message} />
          </div>
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target URL
            </p>
            <p className="mt-2 break-all rounded-xl bg-[#f5f7fb] p-4 text-sm text-slate-600">
              {activity.target}
            </p>
          </div>
        </section>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[#102a43]">
            Execution log
          </h2>
          <div className="mt-6 space-y-5">
            <LogItem time="10:20:04 AM" text="Action started" />
            <LogItem time="10:20:08 AM" text="Account authorization checked" />
            <LogItem
              time="10:21:16 AM"
              text={
                isSuccess
                  ? "Target content opened"
                  : "Authorization token rejected"
              }
            />
            <LogItem
              time="10:22:18 AM"
              text={activity.message}
              last={!isSuccess}
              error={!isSuccess}
            />
          </div>
        </section>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/actions/run")}
            className="rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
          >
            Run again
          </button>
        </div>
      </ViewShell>
    </div>,
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#102a43]">
        {value}
      </p>
    </div>
  );
}
function LogItem({
  time,
  text,
  last = false,
  error = false,
}: {
  time: string;
  text: string;
  last?: boolean;
  error?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span
        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${error ? "bg-[#c24141]" : last ? "bg-[#57cc99]" : "bg-[#2f80ed]"}`}
      />
      <div>
        <p className="text-sm font-semibold text-[#102a43]">{text}</p>
        <p className="mt-1 text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}

export default ActivityDetailsView;
