import { useNavigate, useParams } from "react-router-dom";
import { getStoredActivity } from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";

const activityDetails = {
  "maria-open-content": {
    account: "@maria.studio",
    platform: "TikTok",
    action: "Open content",
    status: "Success",
    date: "Today, 10:24 AM",
    target: "https://www.tiktok.com/@creator/video/123456789",
    duration: "2m 14s",
    message: "Content opened successfully",
  },
  "growth-review-content": {
    account: "Growth Lab",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
    date: "Today, 9:58 AM",
    target: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "1m 42s",
    message: "Video opened successfully",
  },
  "northstar-open-content": {
    account: "@northstar.co",
    platform: "TikTok",
    action: "Open content",
    status: "Failed",
    date: "Yesterday, 4:12 PM",
    target: "https://www.tiktok.com/@creator/video/987654321",
    duration: "18s",
    message: "Authorization expired",
  },
  "creator-review-content": {
    account: "Creator Weekly",
    platform: "YouTube",
    action: "Review channel content",
    status: "Success",
    date: "Sep 07, 11:30 AM",
    target: "https://www.youtube.com/watch?v=abc123",
    duration: "2m 03s",
    message: "Video opened successfully",
  },
};

function ActivityDetailsView() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const activity =
    getStoredActivity(activityId) ??
    (activityId
      ? activityDetails[activityId as keyof typeof activityDetails]
      : undefined);

  if (!activity)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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
        </div>
      </main>
    );

  const isSuccess = activity.status === "Success";
  return (
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
    </div>
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
