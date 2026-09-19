import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../../services/accountsApi";
import { openTikTokPost } from "../../services/tiktokBrowserApi";
import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

function TikTokWorkflowView() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [likeVideo, setLikeVideo] = useState(false);
  const [postComment, setPostComment] = useState(false);
  const [preparedComments, setPreparedComments] = useState<string[]>([]);
  const [commentAssignments, setCommentAssignments] = useState<
    Record<string, number>
  >({});
  const [view, setView] = useState<"form" | "running" | "complete">("form");
  const [result, setResult] = useState<{
    url: string;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    getAccounts()
      .then((items) => {
        const tiktokAccounts = items.filter(
          (account) => account.platform === "TikTok",
        );
        setAccounts(
          tiktokAccounts.map((account) => ({
            id: account.id,
            name: account.name,
          })),
        );
        setSelectedAccountIds([]);
        setPreparedComments(tiktokAccounts.map(() => ""));
      })
      .catch(() => setError("Unable to load connected TikTok accounts."))
      .finally(() => setIsLoadingAccounts(false));
  }, []);

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
                TikTok workflow
              </span>
              <span className="h-11 w-11" />
            </div>
            {content}
          </section>
        </div>
      </main>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setView("form");

    if (!url.trim()) {
      setError("Enter a valid TikTok video URL.");
      return;
    }
    if (selectedAccountIds.length === 0) {
      setError("Select at least one TikTok account.");
      return;
    }
    if (!likeVideo && !postComment) {
      setError("Choose at least one action.");
      return;
    }
    if (
      postComment &&
      selectedAccountIds.some(
        (id) => !preparedComments[commentAssignments[id] ?? 0]?.trim(),
      )
    ) {
      setError("Prepare and assign a comment to every selected account.");
      return;
    }

    setIsOpening(true);
    setView("running");

    try {
      const selectedAction =
        likeVideo && postComment
          ? "like_comment"
          : likeVideo
            ? "like"
            : "comment";

      const responses = await Promise.all(
        selectedAccountIds.map((accountId) =>
          openTikTokPost(
            url.trim(),
            accountId,
            selectedAction,
            postComment
              ? preparedComments[commentAssignments[accountId] ?? 0]?.trim() ||
                  "good"
              : undefined,
          ),
        ),
      );
      setResult({
        ...responses[0],
        message: responses
          .map(
            (response, index) =>
              `${accounts.find((account) => account.id === selectedAccountIds[index])?.name ?? "Account"}: ${response.message}`,
          )
          .join(" "),
      });
      setView("complete");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to execute TikTok workflow.",
      );
    } finally {
      setIsOpening(false);
    }
  }

  if (view === "running") {
    const selectedAccount =
      accounts.find((item) => item.id === selectedAccountIds[0]) ?? null;
    const actionLabel =
      likeVideo && postComment
        ? "Like + comment"
        : likeVideo
          ? "Like enabled"
          : "Comment enabled";

    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow="Actions / Execution"
          title="Action running"
          description="Social Media Manager is working through the selected TikTok account."
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b21a8]">
                  TikTok post
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                  TikTok workflow
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">{url}</p>
              </div>
              <span className="w-fit rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#6b21a8]">
                In progress
              </span>
            </div>
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-[#102a43]">
                  Overall progress
                </span>
                <span className="text-slate-500">0 / 1 completed</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#6b21a8] transition-all duration-500"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-semibold text-slate-500">
                {actionLabel}
              </span>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:grid">
                <span>Account</span>
                <span>Platform</span>
                <span>Status</span>
              </div>
              <div className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1.5fr_1fr_1fr] sm:items-center sm:gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#6b21a8]">
                    {selectedAccount?.name.slice(0, 2).toUpperCase() || "TT"}
                  </span>
                  <span className="text-sm font-semibold text-[#102a43]">
                    {selectedAccount?.name || "Connected account"}
                  </span>
                </div>
                <span className="text-xs text-slate-500">TikTok</span>
                <span className="w-fit rounded-full bg-[#f3e8ff] px-2.5 py-1 text-xs font-semibold text-[#6b21a8]">
                  Running
                </span>
              </div>
            </div>
            <div className="mt-7 flex justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  setView("form");
                  setError("");
                  setResult(null);
                  setIsOpening(false);
                }}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
              >
                Back to actions
              </button>
            </div>
          </section>
        </ViewShell>
      </div>,
    );
  }

  if (view === "complete" && result) {
    return renderPage(
      <div className="mx-auto w-full max-w-5xl">
        <ViewShell
          eyebrow="Actions / Complete"
          title="TikTok workflow complete"
          description="The selected account finished the requested TikTok action."
        >
          <section className="rounded-2xl border border-[#b7ebd0] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16845b]">
                  Action summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#102a43]">
                  {result.title || "TikTok action completed"}
                </h2>
              </div>
              <div className="rounded-xl bg-[#f5f7fb] p-4 text-sm text-slate-600">
                <p className="break-all">{result.url}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {result.message}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setView("form")}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#102a43] hover:bg-slate-50"
                >
                  Run another action
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAccountIds([])}
                  className="rounded-xl bg-[#6b21a8] px-4 py-3 text-sm font-semibold text-white hover:bg-[#581c87]"
                >
                  Use same account
                </button>
              </div>
            </div>
          </section>
        </ViewShell>
      </div>,
    );
  }

  if (isLoadingAccounts)
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm text-slate-500">Loading TikTok accounts...</p>
      </div>,
    );

  if (!accounts.length) {
    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b21a8]">
            No TikTok accounts
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[#102a43]">
            Connect a TikTok account first
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            You need at least one connected TikTok account before starting a
            workflow.
          </p>
          <button
            type="button"
            onClick={() => navigate("/connect/tiktok")}
            className="mt-6 rounded-xl bg-[#6b21a8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#581c87]"
          >
            Connect TikTok
          </button>
        </div>
      </div>,
    );
  }

  return renderPage(
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="TikTok / Workflow"
        title="TikTok engagement workflow"
        description="Open the target TikTok video in Chromium and perform the selected browser action."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8ff] text-sm font-bold text-[#6b21a8]">
                1
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#102a43]">
                  Target video
                </h3>
                <p className="text-sm text-slate-500">
                  Paste the exact TikTok video URL to open and act on.
                </p>
              </div>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              TikTok video URL
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.tiktok.com/@creator/video/1234567890"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8ff] text-sm font-bold text-[#6b21a8]">
                2
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#102a43]">
                  Select action
                </h3>
                <p className="text-sm text-slate-500">
                  Choose what each selected TikTok account should do.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-[#2f80ed]">
                <input
                  type="checkbox"
                  checked={likeVideo}
                  onChange={() => setLikeVideo((value) => !value)}
                  className="h-4 w-4 accent-[#6b21a8]"
                />
                <span className="text-sm font-semibold text-[#102a43]">
                  Like video
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:border-[#2f80ed]">
                <input
                  type="checkbox"
                  checked={postComment}
                  onChange={() => setPostComment((value) => !value)}
                  className="h-4 w-4 accent-[#6b21a8]"
                />
                <span className="text-sm font-semibold text-[#102a43]">
                  Post comment
                </span>
              </label>
            </div>

            {postComment && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#102a43]">
                  Prepared comments
                </p>
                <p className="text-xs text-slate-500">
                  Prepare one comment for each connected TikTok account.
                </p>
                {accounts.map((account, index) => (
                  <input
                    key={account.id}
                    value={preparedComments[index] ?? ""}
                    onChange={(event) =>
                      setPreparedComments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    placeholder={`Comment for ${account.name}`}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e8ff] text-sm font-bold text-[#6b21a8]">
                3
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[#102a43]">
                  Accounts
                </h3>
                <p className="text-sm text-slate-500">
                  Select the TikTok accounts that should participate in this
                  workflow.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {accounts.map((account) => {
                const selected = selectedAccountIds.includes(account.id);
                return (
                  <div key={account.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selected ? "border-[#d66b6b] bg-[#fff7f7]" : "border-slate-200"}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(event) =>
                          setSelectedAccountIds((current) =>
                            event.target.checked
                              ? [...current, account.id]
                              : current.filter((id) => id !== account.id),
                          )
                        }
                        className="h-4 w-4 accent-[#6b21a8]"
                      />
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3e8ff] text-xs font-bold text-[#6b21a8]">
                        {account.name.slice(0, 2).toUpperCase()}
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
                        value={commentAssignments[account.id] ?? 0}
                        onChange={(event) =>
                          setCommentAssignments((current) => ({
                            ...current,
                            [account.id]: Number(event.target.value),
                          }))
                        }
                        className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        {preparedComments.map((comment, index) => (
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
          </section>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isOpening || selectedAccountIds.length === 0}
              className="w-full rounded-xl bg-[#dc0000] px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isOpening ? "Starting workflow..." : "Start Workflow"}
            </button>
          </div>
        </form>
      </ViewShell>
    </div>,
  );
}

export default TikTokWorkflowView;
