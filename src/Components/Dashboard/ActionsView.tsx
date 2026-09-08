import { ViewShell } from "./AccountsView";

const actions = [
  {
    title: "Open content",
    platform: "TikTok",
    description: "Open a supported TikTok content URL with selected accounts.",
    lastRun: "8 minutes ago",
    result: "4 / 5 successful",
  },
  {
    title: "Review channel content",
    platform: "YouTube",
    description: "Open and review a YouTube video from connected channels.",
    lastRun: "Yesterday",
    result: "8 / 8 successful",
  },
];

function ActionsView() {
  return (
    <ViewShell
      eyebrow="Actions"
      title="Action workflows"
      description="Create and manage supported actions for your connected accounts."
    >
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          + New action
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {actions.map((action) => (
          <article
            key={action.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-semibold text-[#1976d2]">
                {action.platform}
              </span>
              <button
                type="button"
                aria-label={`More options for ${action.title}`}
                className="text-lg text-slate-400"
              >
                •••
              </button>
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
            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#102a43] hover:border-[#2f80ed] hover:text-[#1976d2]"
            >
              Run action
            </button>
          </article>
        ))}
      </div>
    </ViewShell>
  );
}

export default ActionsView;
