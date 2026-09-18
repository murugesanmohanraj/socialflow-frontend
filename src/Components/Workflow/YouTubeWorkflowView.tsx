import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import YouTube, { YouTubeEvent } from "react-youtube";
import { getAccounts } from "../../services/accountsApi";
import { createAction } from "../../services/actionsApi";
import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import { EmptyState } from "../Dashboard/ResourceStates";

type Account = { id: string; name: string; initials: string };

function YouTubeWorkflowView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playbackTab = searchParams.get("playback") === "1";
  const playbackSessionId = searchParams.get("session") ?? "";
  const initialPlaybackUrl = searchParams.get("url") ?? "";
  const initialPlaybackCount = Number(searchParams.get("count") ?? 0);
  const [targetUrl, setTargetUrl] = useState(initialPlaybackUrl);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [likeVideo, setLikeVideo] = useState(false);
  const [postComment, setPostComment] = useState(false);
  const [repetitions, setRepetitions] = useState(
    playbackTab && initialPlaybackCount > 0 ? initialPlaybackCount : 0,
  );
  const [comments, setComments] = useState(["", "", ""]);
  const [assignments, setAssignments] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [completedPlaybacks, setCompletedPlaybacks] = useState(0);
  const [playbackSession, setPlaybackSession] = useState<{
    id: string;
    total: number;
    completed: number;
  } | null>(null);
  const showEngagementActions = repetitions === 0;
  const showPlaybackRepetitions = !likeVideo && !postComment;
  const isPlaybackWorkflow = repetitions > 0;

  useEffect(() => {
    if (playbackTab || !playbackSession) return;
    const channel = new BroadcastChannel("socialflow-youtube-playback");
    channel.onmessage = (event: MessageEvent) => {
      if (
        event.data?.type === "playback-progress" &&
        event.data.sessionId === playbackSession.id
      ) {
        setPlaybackSession((current) =>
          current ? { ...current, completed: event.data.completed } : current,
        );
      }
      if (
        event.data?.type === "playback-complete" &&
        event.data.sessionId === playbackSession.id
      ) {
        setPlaybackSession((current) =>
          current ? { ...current, completed: current.total } : current,
        );
      }
    };
    return () => channel.close();
  }, [playbackSession, playbackTab]);

  useEffect(() => {
    getAccounts()
      .then((items) =>
        setAccounts(
          items
            .filter(
              (item) =>
                item.platform === "YouTube" && item.status === "Connected",
            )
            .map((item) => ({
              id: item.id,
              name: item.name,
              initials: item.initials,
            })),
        ),
      )
      .catch(() => setError("Unable to load connected YouTube accounts."))
      .finally(() => setIsLoading(false));
  }, []);

  function validUrl(value: string) {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        (url.hostname === "youtu.be" ||
          url.hostname === "youtube.com" ||
          url.hostname.endsWith(".youtube.com"))
      );
    } catch {
      return false;
    }
  }

  function toggleAccount(id: string) {
    setSelectedAccounts((current) =>
      current.includes(id)
        ? current.filter((accountId) => accountId !== id)
        : [...current, id],
    );
    setAssignments((current) => {
      if (current[id] !== undefined) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: 0 };
    });
  }

  async function startWorkflow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!validUrl(targetUrl))
      return setError("Enter a valid YouTube video URL.");
    if (repetitions > 0) {
      const sessionId = crypto.randomUUID();
      const playbackUrl = new URL("/youtube-workflow", window.location.origin);
      playbackUrl.searchParams.set("playback", "1");
      playbackUrl.searchParams.set("session", sessionId);
      playbackUrl.searchParams.set("url", targetUrl.trim());
      playbackUrl.searchParams.set("count", String(repetitions));
      const playbackWindow = window.open(
        playbackUrl.toString(),
        "socialflow-youtube-playback",
      );
      if (!playbackWindow) {
        return setError(
          "The playback tab was blocked. Allow pop-ups and try again.",
        );
      }
      setPlaybackSession({ id: sessionId, total: repetitions, completed: 0 });
      return;
    }
    if (repetitions === 0 && !likeVideo && !postComment)
      return setError("Choose at least one engagement action.");
    if (selectedAccounts.length === 0)
      return setError("Select at least one YouTube account.");
    const commentAssignments = selectedAccounts.map((accountId) => ({
      accountId,
      commentText: comments[assignments[accountId] ?? 0]?.trim() ?? "",
    }));
    if (postComment && commentAssignments.some((item) => !item.commentText)) {
      return setError(
        "Add a prepared comment and assign one to every selected account.",
      );
    }
    setIsStarting(true);
    try {
      const action = await createAction({
        title:
          likeVideo && postComment
            ? "Like and comment on YouTube video"
            : likeVideo
              ? "Like YouTube video"
              : postComment
                ? "Comment on YouTube video"
                : "YouTube playback workflow",
        platform: "YouTube",
        actionType: likeVideo
          ? "Like video"
          : postComment
            ? "Comment on video"
            : "Watch video",
        targetUrl: targetUrl.trim(),
        accountIds: selectedAccounts,
        repetitions,
        likeContent: likeVideo,
        postComment,
        commentAssignments: postComment ? commentAssignments : undefined,
      });
      navigate(`/actions/run/${action.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start workflow.",
      );
    } finally {
      setIsStarting(false);
    }
  }

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
                YouTube workflow
              </span>
              <span className="h-11 w-11" />
            </div>
            {content}
          </section>
        </div>
      </main>
    );
  }

  if (isLoading)
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm text-slate-500">Loading YouTube accounts...</p>
      </div>,
    );
  if (!accounts.length && !isPlaybackWorkflow) {
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <EmptyState
          title="No connected YouTube accounts"
          description="Connect a YouTube channel before starting a workflow."
          action={{
            label: "Connect YouTube",
            onClick: () => navigate("/connect/youtube"),
          }}
        />
      </div>,
    );
  }

  function getVideoId(value: string) {
    try {
      const url = new URL(value);
      if (url.hostname === "youtu.be") return url.pathname.slice(1);
      return url.searchParams.get("v") ?? "";
    } catch {
      return "";
    }
  }

  function handlePlaybackEnd(event: YouTubeEvent) {
    const nextCompleted = completedPlaybacks + 1;
    setCompletedPlaybacks(nextCompleted);
    const channel = new BroadcastChannel("socialflow-youtube-playback");
    channel.postMessage({
      type:
        nextCompleted < repetitions ? "playback-progress" : "playback-complete",
      sessionId: playbackSessionId,
      completed: nextCompleted,
    });
    channel.close();
    if (nextCompleted < repetitions) {
      window.setTimeout(() => event.target.playVideo(), 500);
    } else {
      window.setTimeout(() => window.close(), 500);
    }
  }

  if (playbackTab) {
    const finished = completedPlaybacks >= repetitions;
    return renderPage(
      <div className="mx-auto w-full max-w-6xl p-5">
        <ViewShell
          eyebrow="YouTube / Playback"
          title={finished ? "Playback complete" : "Playback in progress"}
          description="Play the visible YouTube video. The next playback starts after the current one ends."
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black [&>div]:h-full [&>div]:w-full [&_iframe]:h-full [&_iframe]:w-full">
              <YouTube
                videoId={getVideoId(targetUrl)}
                className="h-full w-full"
                iframeClassName="h-full w-full"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1, mute: 1, controls: 1 },
                }}
                onEnd={handlePlaybackEnd}
              />
            </div>
            <p className="mt-5 text-sm font-semibold text-[#102a43]">
              {completedPlaybacks} / {repetitions} playbacks completed
            </p>
            {finished && (
              <p className="mt-2 text-sm text-[#16845b]">
                Playback workflow completed in the visible YouTube player.
              </p>
            )}
            <p className="mt-6 text-xs text-slate-500">
              This playback tab closes automatically when the final playback
              ends.
            </p>
          </section>
        </ViewShell>
      </div>,
    );
  }

  if (playbackSession) {
    const progress = Math.round(
      (playbackSession.completed / playbackSession.total) * 100,
    );
    const finished = playbackSession.completed >= playbackSession.total;
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow="YouTube / Playback"
          title={
            finished ? "Playback workflow complete" : "Playback in progress"
          }
          description="The video is playing in the separate playback tab. This page tracks its progress."
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-[#102a43]">
                {playbackSession.completed} / {playbackSession.total} playbacks
                completed
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${finished ? "bg-[#e8f8f0] text-[#16845b]" : "bg-[#eaf2fc] text-[#1976d2]"}`}
              >
                {finished ? "Complete" : "Running"}
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#57cc99] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {finished
                ? "The playback tab has finished and should close automatically."
                : "Keep the playback tab open while the video completes."}
            </p>
            {finished && (
              <button
                type="button"
                onClick={() => setPlaybackSession(null)}
                className="mt-6 rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white"
              >
                Start another workflow
              </button>
            )}
          </section>
        </ViewShell>
      </div>,
    );
  }

  return renderPage(
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="YouTube / Workflow"
        title="YouTube engagement workflow"
        description="Prepare one video workflow and assign comments to the participating channels."
      >
        <form onSubmit={startWorkflow} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="1"
              title="Target video"
              description="Enter the exact URL of the YouTube video to process."
            >
              <label className="block text-sm font-semibold text-slate-700">
                YouTube video URL
                <input
                  required
                  value={targetUrl}
                  onChange={(event) => setTargetUrl(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
                />
              </label>
            </Step>
          </section>

          {showEngagementActions && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <Step
                number="2"
                title="Engagement actions"
                description="Choose what each authorized YouTube account should do."
              >
                <div className="space-y-3">
                  <CheckRow
                    checked={likeVideo}
                    onChange={() => setLikeVideo((value) => !value)}
                    label="Like video (Official API)"
                  />
                  <CheckRow
                    checked={postComment}
                    onChange={() => setPostComment((value) => !value)}
                    label="Post comment (Official API)"
                  />
                </div>
                {postComment && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold text-[#102a43]">
                      Prepared comments
                    </p>
                    <p className="text-xs text-slate-500">
                      Prepare up to 3 comments. You will assign one to each
                      account below.
                    </p>
                    {comments.map((comment, index) => (
                      <input
                        key={index}
                        value={comment}
                        onChange={(event) =>
                          setComments((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? event.target.value : item,
                            ),
                          )
                        }
                        placeholder={`Prepared Comment ${index + 1}`}
                        maxLength={1000}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
                      />
                    ))}
                  </div>
                )}
              </Step>
            </section>
          )}

          {showPlaybackRepetitions && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <Step
                number="3"
                title="Playback repetitions per account"
                description="Choose how many processing passes each selected account should complete."
              >
                <select
                  value={repetitions}
                  onChange={(event) =>
                    setRepetitions(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
                >
                  <option value={0}>0 Playbacks (Skip Playback)</option>
                  {[1, 2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>
                      {count} Complete Playback{count === 1 ? "" : "s"}
                      {count === 4 ? " (Requested Test)" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Choose at least one playback when no engagement action is
                  selected.
                </p>
              </Step>
            </section>
          )}

          {showEngagementActions && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <Step
                number="4"
                title="Accounts"
                description="Select participating accounts and assign a prepared comment to each one."
              >
                <div className="space-y-3">
                  {accounts.map((account) => {
                    const selected = selectedAccounts.includes(account.id);
                    return (
                      <div
                        key={account.id}
                        className={`rounded-xl border p-4 ${selected ? "border-[#d66b6b] bg-[#fff7f7]" : "border-slate-200"}`}
                      >
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleAccount(account.id)}
                            className="h-4 w-4 accent-[#1976d2]"
                          />
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf2fc] text-xs font-bold text-[#1976d2]">
                            {account.initials}
                          </span>
                          <span className="text-sm font-semibold text-[#102a43]">
                            {account.name}
                          </span>
                          <span className="ml-auto rounded-full bg-[#e8f8f0] px-2.5 py-1 text-xs font-semibold text-[#16845b]">
                            Ready
                          </span>
                        </label>
                        {selected && postComment && (
                          <select
                            value={assignments[account.id] ?? 0}
                            onChange={(event) =>
                              setAssignments((current) => ({
                                ...current,
                                [account.id]: Number(event.target.value),
                              }))
                            }
                            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#2f80ed]"
                          >
                            {comments.map((comment, index) => (
                              <option
                                key={index}
                                value={index}
                                disabled={!comment.trim()}
                              >
                                Comment {index + 1}:{" "}
                                {comment.trim() || "Not prepared"}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Step>
            </section>
          )}

          {error && (
            <p className="rounded-xl bg-[#fff0f0] p-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isStarting}
            className="w-full rounded-xl bg-[#dc0000] px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStarting ? "Starting workflow..." : "Start Workflow"}
          </button>
          <p className="text-center text-xs text-slate-400">
            Requires a video URL and at least one account.
          </p>
        </form>
      </ViewShell>
    </div>,
  );
}

function Step({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf2fc] text-sm font-bold text-[#1976d2]">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#102a43]">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
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

export default YouTubeWorkflowView;
