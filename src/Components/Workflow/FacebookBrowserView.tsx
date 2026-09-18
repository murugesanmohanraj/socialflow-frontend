import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountsApi";
import { openFacebookPost } from "../../services/facebookBrowserApi";
import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

function FacebookBrowserView() {
  const [url, setUrl] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [likePost, setLikePost] = useState(false);
  const [postComment, setPostComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [view, setView] = useState<"form" | "running" | "complete">("form");
  const [result, setResult] = useState<{
    url: string;
    title: string;
    loggedIn?: boolean;
    likeCount?: number | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    getAccounts()
      .then((items) => {
        const facebookAccounts = items.filter(
          (account) => account.platform === "Facebook",
        );
        setAccounts(
          facebookAccounts.map((account) => ({
            id: account.id,
            name: account.name,
          })),
        );
        setSelectedAccountId(facebookAccounts[0]?.id ?? "");
      })
      .catch(() => setError("Unable to load connected Facebook accounts."))
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
                Facebook workflow
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
      setError("Enter a valid Facebook post URL.");
      return;
    }
    if (!selectedAccountId) {
      setError("Select at least one Facebook account.");
      return;
    }
    if (!likePost && !postComment) {
      setError("Choose at least one action.");
      return;
    }
    if (postComment && !commentText.trim()) {
      setError("Comment text is required when comment is selected.");
      return;
    }

    setIsOpening(true);
    setView("running");
    try {
      const selectedAction =
        likePost && postComment
          ? "like_comment"
          : likePost
            ? "like"
            : "comment";

      const response = await openFacebookPost(
        url.trim(),
        selectedAccountId,
        selectedAction,
        postComment ? commentText.trim() || "good" : undefined,
      );
      setResult(response);
      setView("complete");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to open Facebook.",
      );
    } finally {
      setIsOpening(false);
    }
  }

  if (view === "running") {
    const selectedAccount =
      accounts.find((item) => item.id === selectedAccountId) ?? null;
    const actionLabel =
      likePost && postComment
        ? "Like + comment"
        : likePost
          ? "Like enabled"
          : "Comment enabled";

    return renderPage(
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow="Actions / Execution"
          title="Action running"
          description="Social Media Manager is working through the selected account."
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                  Facebook post
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                  Facebook workflow
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">{url}</p>
              </div>
              <span className="w-fit rounded-full bg-[#eaf2fc] px-3 py-1 text-xs font-semibold text-[#1976d2]">
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
                  className="h-full rounded-full bg-[#57cc99] transition-all duration-500"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                This preview updates automatically to simulate execution.
              </p>
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf2fc] text-xs font-bold text-[#1976d2]">
                    {selectedAccount?.name.slice(0, 2).toUpperCase() || "FB"}
                  </span>
                  <span className="text-sm font-semibold text-[#102a43]">
                    {selectedAccount?.name || "Connected account"}
                  </span>
                </div>
                <span className="text-xs text-slate-500">Facebook</span>
                <span className="w-fit rounded-full bg-[#eaf2fc] px-2.5 py-1 text-xs font-semibold text-[#1976d2]">
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
      <div className="mx-auto w-full max-w-6xl">
        <ViewShell
          eyebrow="Actions / Execution"
          title="Action completed"
          description="The workflow finished for the selected account."
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                  Facebook post
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                  Facebook workflow
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">
                  {result.url}
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#e8f8f0] px-3 py-1 text-xs font-semibold text-[#16845b]">
                Complete
              </span>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-[#102a43]">
                  Overall progress
                </span>
                <span className="text-slate-500">1 / 1 completed</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#57cc99] transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                All account workflows have finished.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-semibold text-slate-500">
                {likePost && postComment
                  ? "Like + comment"
                  : likePost
                    ? "Like enabled"
                    : "Comment enabled"}
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf2fc] text-xs font-bold text-[#1976d2]">
                    {accounts
                      .find((item) => item.id === selectedAccountId)
                      ?.name.slice(0, 2)
                      .toUpperCase() || "FB"}
                  </span>
                  <span className="text-sm font-semibold text-[#102a43]">
                    {accounts.find((item) => item.id === selectedAccountId)
                      ?.name || "Connected account"}
                  </span>
                </div>
                <span className="text-xs text-slate-500">Facebook</span>
                <span className="w-fit rounded-full bg-[#e8f8f0] px-2.5 py-1 text-xs font-semibold text-[#16845b]">
                  Completed
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setView("form");
                  setResult(null);
                  setError("");
                  setIsOpening(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43] sm:w-auto"
              >
                Back to actions
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("form");
                }}
                className="w-full rounded-xl bg-[#102a43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#183f60] sm:w-auto"
              >
                View results
              </button>
            </div>
          </section>
        </ViewShell>
      </div>,
    );
  }

  return renderPage(
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Facebook / Workflow"
        title="Facebook engagement workflow"
        description="Prepare a Facebook post workflow and assign the action to the selected account."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="1"
              title="Target post"
              description="Enter the exact URL of the Facebook post to process."
            >
              <label className="block text-sm font-semibold text-slate-700">
                Facebook post URL
                <input
                  required
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
                />
              </label>
            </Step>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="2"
              title="Engagement actions"
              description="Choose what the selected Facebook account should do."
            >
              <div className="space-y-3">
                <CheckRow
                  checked={likePost}
                  onChange={() => setLikePost((value) => !value)}
                  label="Like post (Browser)"
                />
                <CheckRow
                  checked={postComment}
                  onChange={() => setPostComment((value) => !value)}
                  label="Post comment (Browser)"
                />
              </div>

              {postComment && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold text-[#102a43]">
                    Comment text
                  </p>
                  <input
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write a comment for the selected post"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
                  />
                </div>
              )}
            </Step>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="3"
              title="Accounts"
              description="Select the Facebook account to use for this workflow."
            >
              <div className="space-y-3">
                {accounts.length === 0 && !isLoadingAccounts ? (
                  <p className="text-sm text-slate-500">
                    No connected Facebook accounts found.
                  </p>
                ) : (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`rounded-xl border p-4 ${selectedAccountId === account.id ? "border-[#d66b6b] bg-[#fff7f7]" : "border-slate-200"}`}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          checked={selectedAccountId === account.id}
                          onChange={() => setSelectedAccountId(account.id)}
                          className="h-4 w-4 accent-[#1976d2]"
                        />
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf2fc] text-xs font-bold text-[#1976d2]">
                          {account.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-[#102a43]">
                          {account.name}
                        </span>
                        <span className="ml-auto rounded-full bg-[#e8f8f0] px-2.5 py-1 text-xs font-semibold text-[#16845b]">
                          Ready
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </Step>
          </section>

          {error && (
            <p className="rounded-xl bg-[#fff0f0] p-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isOpening || isLoadingAccounts || !selectedAccountId}
            className="w-full rounded-xl bg-[#dc0000] px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isOpening ? "Opening browser..." : "Start Workflow"}
          </button>
          <p className="text-center text-xs text-slate-400">
            Requires a post URL and at least one connected account.
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

export default FacebookBrowserView;
