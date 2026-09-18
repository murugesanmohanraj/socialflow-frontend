import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountsApi";
import { openInstagramPost } from "../../services/instagramBrowserApi";
import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

function InstagramBrowserView() {
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
    message: string;
  } | null>(null);

  useEffect(() => {
    getAccounts()
      .then((items) => {
        const instagramAccounts = items.filter(
          (account) => account.platform === "Instagram",
        );
        setAccounts(
          instagramAccounts.map((account) => ({
            id: account.id,
            name: account.name,
          })),
        );
        setSelectedAccountId(instagramAccounts[0]?.id ?? "");
      })
      .catch(() => setError("Unable to load connected Instagram accounts."))
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
                Instagram workflow
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
      setError("Enter a valid Instagram post URL.");
      return;
    }
    if (!selectedAccountId) {
      setError("Select at least one Instagram account.");
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

      const response = await openInstagramPost(
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
          : "Unable to open Instagram.",
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
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#be185d]">
                  Instagram post
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#102a43]">
                  Instagram workflow
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">{url}</p>
              </div>
              <span className="w-fit rounded-full bg-[#fce7f3] px-3 py-1 text-xs font-semibold text-[#be185d]">
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
                  className="h-full rounded-full bg-[#be185d] transition-all duration-500"
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fce7f3] text-xs font-bold text-[#be185d]">
                    {selectedAccount?.name.slice(0, 2).toUpperCase() || "IG"}
                  </span>
                  <span className="text-sm font-semibold text-[#102a43]">
                    {selectedAccount?.name || "Connected account"}
                  </span>
                </div>
                <span className="text-xs text-slate-500">Instagram</span>
                <span className="w-fit rounded-full bg-[#fce7f3] px-2.5 py-1 text-xs font-semibold text-[#be185d]">
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
          title="Instagram workflow complete"
          description="The selected account finished the requested Instagram action."
        >
          <section className="rounded-2xl border border-[#b7ebd0] bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16845b]">
                  Action summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#102a43]">
                  {result.title || "Instagram action completed"}
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
                  onClick={() => setSelectedAccountId(accounts[0]?.id ?? "")}
                  className="rounded-xl bg-[#be185d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#9d174d]"
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

  return renderPage(
    <div className="mx-auto w-full max-w-5xl">
      <ViewShell
        eyebrow="Instagram / Workflow"
        title="Instagram engagement workflow"
        description="Prepare an Instagram post workflow and assign the action to the selected account."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Post URL
                </span>
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://www.instagram.com/p/...."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#be185d] focus:ring-4 focus:ring-[#fbcfe8]"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Account
                </span>
                <select
                  value={selectedAccountId}
                  onChange={(event) => setSelectedAccountId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#be185d] focus:ring-4 focus:ring-[#fbcfe8]"
                  disabled={isLoadingAccounts || accounts.length === 0}
                >
                  {accounts.length === 0 ? (
                    <option value="">No connected Instagram accounts</option>
                  ) : (
                    accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={likePost}
                  onChange={(event) => setLikePost(event.target.checked)}
                  className="h-4 w-4 accent-[#be185d]"
                />
                <span className="text-sm font-semibold text-[#102a43]">
                  Like post
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={postComment}
                  onChange={(event) => setPostComment(event.target.checked)}
                  className="h-4 w-4 accent-[#be185d]"
                />
                <span className="text-sm font-semibold text-[#102a43]">
                  Comment
                </span>
              </label>
            </div>

            {postComment && (
              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Comment text
                </span>
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#be185d] focus:ring-4 focus:ring-[#fbcfe8]"
                  placeholder="Write the comment to post"
                />
              </label>
            )}

            {error ? (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            ) : null}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isOpening || isLoadingAccounts}
                className="rounded-xl bg-[#be185d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#9d174d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isOpening ? "Running..." : "Run workflow"}
              </button>
            </div>
          </div>
        </form>
      </ViewShell>
    </div>,
  );
}

export default InstagramBrowserView;
