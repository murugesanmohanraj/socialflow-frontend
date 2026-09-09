import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStoredActions,
  saveActions,
  StoredAction,
} from "../../utils/socialflowStorage";
import { ViewShell } from "./AccountsView";
import { EmptyState, ErrorState, LoadingState } from "./ResourceStates";

function ActionsView() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actions, setActions] = useState<StoredAction[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [actionToRemove, setActionToRemove] = useState<string | null>(null);

  function loadActions() {
    setHasError(false);
    setActions(null);
    window.setTimeout(() => {
      try {
        setActions(getStoredActions());
      } catch {
        setHasError(true);
      }
    }, 300);
  }

  useEffect(() => {
    loadActions();
  }, []);

  function removeAction(id: string) {
    if (!actions) return;
    const nextActions = actions.filter((action) => action.id !== id);
    setActions(nextActions);
    saveActions(nextActions);
    setOpenMenuId(null);
    setActionToRemove(null);
  }

  return (
    <ViewShell
      eyebrow="Actions"
      title="Action workflows"
      description="Create and manage supported actions for your connected accounts."
    >
      <div className="mb-6 flex justify-end">
        <Link
          to="/actions/new"
          className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          + New action
        </Link>
      </div>
      {hasError ? (
        <ErrorState onRetry={loadActions} />
      ) : actions === null ? (
        <LoadingState label="Loading action workflows..." />
      ) : actions.length === 0 ? (
        <EmptyState
          title="No actions created"
          description="Create your first supported workflow to start managing social content."
          action={{
            label: "Create action",
            onClick: () => window.location.assign("/actions/new"),
          }}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {actions.map((action) => (
            <article
              key={action.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-semibold text-[#1976d2]">
                  {action.platform}
                </span>
                <button
                  type="button"
                  aria-label={`More options for ${action.title}`}
                  aria-expanded={openMenuId === action.id}
                  onClick={() =>
                    setOpenMenuId((current) =>
                      current === action.id ? null : action.id,
                    )
                  }
                  className="rounded-lg px-2 text-lg text-slate-400 hover:bg-slate-100 hover:text-[#102a43]"
                >
                  •••
                </button>
                {openMenuId === action.id && (
                  <div className="absolute right-6 top-14 z-10 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <Link
                      to={`/actions/result/${action.id}`}
                      onClick={() => setOpenMenuId(null)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      View results
                    </Link>
                    <Link
                      to="/actions/new"
                      onClick={() => setOpenMenuId(null)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Edit action
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        setActionToRemove(action.id);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#c24141] hover:bg-[#fff0f0]"
                    >
                      Remove action
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-[#102a43]">
                {action.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">Last run</p>
                  <p className="mt-1 text-sm font-semibold text-[#102a43]">
                    {action.lastRun}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Result</p>
                  <p className="mt-1 text-sm font-semibold text-[#16845b]">
                    {action.result}
                  </p>
                </div>
              </div>
              <Link
                to={`/actions/run/${action.id}`}
                className="mt-6 block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-[#102a43] hover:border-[#2f80ed] hover:text-[#1976d2]"
              >
                Run action
              </Link>
            </article>
          ))}
        </div>
      )}
      {actionToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/40 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-action-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2
              id="remove-action-title"
              className="text-lg font-semibold text-[#102a43]"
            >
              Remove this action?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This removes the workflow from your local workspace. You can
              create it again later.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setActionToRemove(null)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeAction(actionToRemove)}
                className="rounded-xl bg-[#c24141] px-4 py-3 text-sm font-semibold text-white hover:bg-[#991b1b]"
              >
                Remove action
              </button>
            </div>
          </div>
        </div>
      )}
    </ViewShell>
  );
}

export default ActionsView;
