import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStoredAction } from "../../utils/socialflowStorage";
import { ViewShell } from "../Dashboard/AccountsView";

type WorkflowPlatform = "TikTok" | "YouTube";

type PlatformWorkflowViewProps = {
  platform: WorkflowPlatform;
};

const workflowAccounts = {
  TikTok: [
    { id: "maria-studio", name: "@maria.studio" },
    { id: "northstar-co", name: "@northstar.co" },
  ],
  YouTube: [
    { id: "growth-lab", name: "Growth Lab" },
    { id: "creator-weekly", name: "Creator Weekly" },
  ],
};

function PlatformWorkflowView({ platform }: PlatformWorkflowViewProps) {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [repetitions, setRepetitions] = useState("4");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [likeContent, setLikeContent] = useState(false);
  const [postComment, setPostComment] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [workflowActionId, setWorkflowActionId] = useState("");
  const accounts = workflowAccounts[platform];
  const isYouTube = platform === "YouTube";

  function toggleAccount(id: string) {
    setSelectedAccounts((current) =>
      current.includes(id)
        ? current.filter((accountId) => accountId !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isValidPlatformUrl(videoUrl)) {
      setError(`Enter a valid ${platform} video URL.`);
      return;
    }
    if (selectedAccounts.length === 0) {
      setError(`Select at least one ${platform} account.`);
      return;
    }
    const actionId = `${platform.toLowerCase()}-workflow-${Date.now()}`;
    addStoredAction({
      id: actionId,
      title: `${platform} workflow`,
      platform,
      description: `${repetitions} playback repetitions per selected account.`,
      targetUrl: videoUrl,
      accountIds: selectedAccounts,
      lastRun: "Not run yet",
      result: "Not run yet",
      repetitions: Number(repetitions),
      likeContent,
      postComment,
    });
    setWorkflowActionId(actionId);
    setCreated(true);
  }

  function isValidPlatformUrl(value: string) {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        (isYouTube
          ? url.hostname.includes("youtube.com") ||
            url.hostname.includes("youtu.be")
          : url.hostname.includes("tiktok.com"))
      );
    } catch {
      return false;
    }
  }

  if (created) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow={`${platform} / Workflow`}
          title="Workflow ready"
          description="Your platform workflow has been saved and is ready to run."
        >
          <section className="mx-auto max-w-xl rounded-2xl border border-[#b7ebd0] bg-white p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f5e7] text-2xl font-bold text-[#16845b]">
              ✓
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#102a43]">
              {platform} workflow saved
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {repetitions} playback repetitions are configured for{" "}
              {selectedAccounts.length} selected account
              {selectedAccounts.length === 1 ? "" : "s"}.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate(`/actions/run/${workflowActionId}`)}
                className="rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
              >
                Run workflow
              </button>
            </div>
          </section>
        </ViewShell>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Workflows"
        title={`${platform} Workflow`}
        description={
          isYouTube
            ? "Automate full-video playbacks and optional engagement actions across connected YouTube channels."
            : "Automate supported video workflows and optional engagement actions across connected TikTok accounts."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-[#102a43]">
              1. Video Setup
            </h2>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                {platform} Video URL
              </span>
              <input
                required
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder={
                  isYouTube
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://www.tiktok.com/@creator/video/..."
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
              />
            </label>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-[#102a43]">
              2. Workflow Configuration
            </h2>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Playback Repetitions per Account
              </span>
              <select
                value={repetitions}
                onChange={(event) => setRepetitions(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
              >
                <option value="1">1 Complete Playback</option>
                <option value="2">2 Complete Playbacks</option>
                <option value="4">4 Complete Playbacks (Requested Test)</option>
                <option value="8">8 Complete Playbacks</option>
              </select>
              <span className="mt-2 block text-xs text-slate-400">
                Each playback watches the video from beginning to end.
              </span>
            </label>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <CheckOption
                label="Like video"
                checked={likeContent}
                onChange={() => setLikeContent((current) => !current)}
              />
              <CheckOption
                label="Post comment (if available)"
                checked={postComment}
                onChange={() => setPostComment((current) => !current)}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-[#102a43]">
              3. Connected Accounts
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Select the {platform} accounts that should run this workflow.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {accounts.map((account) => (
                <label
                  key={account.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selectedAccounts.includes(account.id) ? "border-[#2f80ed] bg-[#eaf2fc]" : "border-slate-200 hover:border-[#2f80ed]"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => toggleAccount(account.id)}
                    className="h-4 w-4 accent-[#1976d2]"
                  />
                  <span className="text-sm font-semibold text-[#102a43]">
                    {account.name}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              {selectedAccounts.length} account
              {selectedAccounts.length === 1 ? "" : "s"} selected
            </p>
          </section>
          {error && (
            <p className="rounded-xl border border-[#f3c5c5] bg-[#fffafa] px-4 py-3 text-sm font-medium text-[#c24141]">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
            >
              Start {platform} workflow
            </button>
          </div>
        </form>
      </ViewShell>
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#1976d2]"
      />
      {label}
    </label>
  );
}

export default PlatformWorkflowView;
