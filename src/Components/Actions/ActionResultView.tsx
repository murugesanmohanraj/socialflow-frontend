import { useNavigate, useParams } from "react-router-dom";
import {
  getStoredAction,
  getStoredAccount,
} from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";
import { EmptyState } from "../Dashboard/ResourceStates";

function ActionResultView() {
  const navigate = useNavigate();
  const { actionId } = useParams();
  const action = getStoredAction(actionId);
  const resultRows =
    action?.accountIds.map((accountId, index) => {
      const account = getStoredAccount(accountId);
      const failed = account?.status === "Needs attention";
      return {
        name: account?.name ?? "Unknown account",
        platform: account?.platform ?? action.platform,
        status: failed ? "Failed" : "Success",
        detail: failed
          ? "Authorization expired"
          : `${action.title} completed successfully`,
        time: `10:2${index}:0${index} AM`,
      };
    }) ?? [];
  const successful = resultRows.filter(
    (row) => row.status === "Success",
  ).length;

  if (!action || resultRows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <EmptyState
          title="Action results unavailable"
          description="This action has no saved execution data yet. Return to Actions to choose a workflow."
          action={{
            label: "Back to actions",
            onClick: () => navigate("/actions"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Actions / Results"
        title="Action results"
        description="Review the outcome and execution details for each account."
      >
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16845b]">
                Completed workflow
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                {action.title}
              </h2>
              <p className="mt-2 break-all text-sm text-slate-500">
                {action.targetUrl}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${resultRows.length - successful > 0 ? "bg-[#fff7e6] text-[#b45309]" : "bg-[#e8f8f0] text-[#16845b]"}`}
            >
              {resultRows.length - successful} failed
            </span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ResultStat label="Accounts" value={String(resultRows.length)} />
            <ResultStat
              label="Successful"
              value={String(successful)}
              tone="text-[#16845b]"
            />
            <ResultStat
              label="Failed"
              value={String(resultRows.length - successful)}
              tone="text-[#c24141]"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-semibold text-slate-500">
              {action.repetitions ?? 1} playback
              {(action.repetitions ?? 1) === 1 ? "" : "s"} per account
            </span>
            {action.likeContent && (
              <span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-semibold text-[#1976d2]">
                Like enabled
              </span>
            )}
            {action.postComment && (
              <span className="rounded-full bg-[#fff7e6] px-3 py-1 text-xs font-semibold text-[#b45309]">
                Comment enabled
              </span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#102a43]">
                Execution details
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Completed today at 10:26 AM
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/activity")}
              className="self-start text-sm font-semibold text-[#1976d2] hover:text-[#102a43] sm:self-auto"
            >
              View activity
            </button>
          </div>
          <div className="space-y-3">
            {resultRows.map((row) => (
              <div
                key={row.name}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-[#102a43]">
                    {row.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.platform} · {row.detail}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{row.time}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === "Success" ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#fff0f0] text-[#c24141]"}`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/actions")}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43] sm:w-auto"
            >
              Back to actions
            </button>
            <button
              type="button"
              onClick={() => navigate(`/actions/run/${action.id}`)}
              className="w-full rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60] sm:w-auto"
            >
              Run again
            </button>
          </div>
        </section>
      </ViewShell>
    </div>
  );
}

function ResultStat({
  label,
  value,
  tone = "text-[#102a43]",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl bg-[#f5f7fb] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export default ActionResultView;
