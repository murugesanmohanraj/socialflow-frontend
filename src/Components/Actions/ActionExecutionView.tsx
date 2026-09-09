import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStoredAction,
  getStoredAccount,
  addStoredActivity,
} from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";
import { EmptyState } from "../Dashboard/ResourceStates";

type ExecutionStatus = "Pending" | "Running" | "Completed";

function ActionExecutionView() {
  const navigate = useNavigate();
  const { actionId } = useParams();
  const action = getStoredAction(actionId);
  const executionAccounts = useMemo(
    () =>
      action?.accountIds
        .map((accountId) => getStoredAccount(accountId))
        .filter((account): account is NonNullable<typeof account> =>
          Boolean(account),
        ) ?? [],
    [action],
  );
  const executionAccountCount = executionAccounts.length;
  const [completedCount, setCompletedCount] = useState(0);
  const [activityLogged, setActivityLogged] = useState(false);

  useEffect(() => {
    if (completedCount >= executionAccountCount) return undefined;
    const timer = window.setTimeout(
      () => setCompletedCount((count) => count + 1),
      900,
    );
    return () => window.clearTimeout(timer);
  }, [completedCount, executionAccountCount]);

  const isComplete = completedCount === executionAccountCount;
  const progress = Math.round((completedCount / executionAccountCount) * 100);

  useEffect(() => {
    if (!action || !isComplete || activityLogged) return;
    executionAccounts.forEach((account) => {
      const failed = account.status === "Needs attention";
      addStoredActivity({
        id: `${action.id}-${account.id}`,
        date: "Today, 10:26 AM",
        account: account.name,
        platform: account.platform,
        action: action.title,
        status: failed ? "Failed" : "Success",
        target: action.targetUrl,
        duration: `${action.repetitions ?? 1}m 14s`,
        message: failed
          ? "Authorization expired"
          : `${action.title} completed successfully`,
      });
    });
    setActivityLogged(true);
  }, [action, activityLogged, executionAccounts, isComplete]);

  if (!action || executionAccounts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <EmptyState
          title="Action data unavailable"
          description="This action has no saved account selection. Return to Actions and choose an available workflow."
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
        eyebrow="Actions / Execution"
        title={isComplete ? "Action completed" : "Action running"}
        description={
          isComplete
            ? "The workflow finished for all selected accounts."
            : "Social Media Manager is working through the selected accounts."
        }
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                {action.title}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                {action.platform} workflow
              </h2>
              <p className="mt-2 break-all text-sm text-slate-500">
                {action.targetUrl}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${isComplete ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#eaf2fc] text-[#1976d2]"}`}
            >
              {isComplete ? "Complete" : "In progress"}
            </span>
          </div>
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-[#102a43]">
                Overall progress
              </span>
              <span className="text-slate-500">
                {completedCount} / {executionAccountCount} completed
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#57cc99] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {isComplete
                ? "All account workflows have finished."
                : "This preview updates automatically to simulate execution."}
            </p>
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
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:grid">
              <span>Account</span>
              <span>Platform</span>
              <span>Status</span>
            </div>
            {executionAccounts.map((account, index) => (
              <ExecutionRow
                key={account.name}
                name={account.name}
                platform={account.platform}
                initials={account.initials}
                status={getStatus(index, completedCount)}
              />
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
            {isComplete && (
              <button
                type="button"
                onClick={() => navigate(`/actions/result/${action.id}`)}
                className="w-full rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60] sm:w-auto"
              >
                View results
              </button>
            )}
          </div>
        </section>
      </ViewShell>
    </div>
  );
}

function getStatus(index: number, completedCount: number): ExecutionStatus {
  if (index < completedCount) return "Completed";
  if (index === completedCount) return "Running";
  return "Pending";
}
function ExecutionRow({
  name,
  platform,
  initials,
  status,
}: {
  name: string;
  platform: string;
  initials: string;
  status: ExecutionStatus;
}) {
  return (
    <div className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_1fr] sm:items-center sm:gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf2fc] text-xs font-bold text-[#1976d2]">
          {initials}
        </span>
        <span className="text-sm font-semibold text-[#102a43]">{name}</span>
      </div>
      <span className="text-xs text-slate-500">{platform}</span>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Completed" ? "bg-[#e8f8f0] text-[#16845b]" : status === "Running" ? "bg-[#eaf2fc] text-[#1976d2]" : "bg-slate-100 text-slate-500"}`}
      >
        {status === "Running" && "⏳ "}
        {status}
      </span>
    </div>
  );
}

export default ActionExecutionView;
