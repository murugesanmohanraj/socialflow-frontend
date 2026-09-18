import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAction, getExecutionResults } from "../../services/actionsApi";
import { StoredAction } from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import { EmptyState, LoadingState } from "../Dashboard/ResourceStates";

function ActionResultView() {
  const navigate = useNavigate();
  const { actionId } = useParams();
  const [searchParams] = useSearchParams();
  const executionId = searchParams.get("executionId");
  const [action, setAction] = useState<StoredAction | null>(null);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof getExecutionResults>
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
          <section className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
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
                Actions
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
    if (!actionId || !executionId) {
      setHasError(true);
      return;
    }
    Promise.all([getAction(actionId), getExecutionResults(executionId)])
      .then(([loadedAction, loadedResult]) => {
        setAction(loadedAction);
        setResult(loadedResult);
      })
      .catch(() => setHasError(true));
  }, [actionId, executionId]);

  const resultRows =
    result?.execution.items.map((item) => ({
      name: item.accountName,
      platform: action?.platform ?? "",
      status: item.status === "failed" ? "Failed" : "Success",
      detail:
        item.message ?? item.errorMessage ?? "Action completed successfully",
      time:
        item.status === "failed" ? "Execution failed" : "Execution completed",
    })) ?? [];
  const successful = result?.summary.successful ?? 0;
  const failed = result?.summary.failed ?? 0;

  if (hasError) {
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <EmptyState
          title="Action results unavailable"
          description="This action has no saved execution data yet. Return to Actions to choose a workflow."
          action={{
            label: "Back to actions",
            onClick: () => navigate("/actions"),
          }}
        />
      </div>,
    );
  }

  if (!action || !result) {
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <LoadingState label="Loading execution results..." />
      </div>,
    );
  }

  return renderPage(
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
              {failed} failed
            </span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ResultStat label="Accounts" value={String(result.summary.total)} />
            <ResultStat
              label="Successful"
              value={String(successful)}
              tone="text-[#16845b]"
            />
            <ResultStat
              label="Failed"
              value={String(failed)}
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
    </div>,
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
