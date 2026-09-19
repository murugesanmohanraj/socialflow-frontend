import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountsApi";
import {
  openInstagramPost,
  requestInstagramVerificationCode,
  submitInstagramVerificationCode,
} from "../../services/instagramBrowserApi";

import { ViewShell } from "../Dashboard/AccountsView";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

function InstagramBrowserView() {
  const [url, setUrl] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
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
  const [preparedComments, setPreparedComments] = useState<string[]>([]);
  const [commentAssignments, setCommentAssignments] = useState<
    Record<string, number>
  >({});
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] =
    useState(false);
  const [isRequestingNewCode, setIsRequestingNewCode] = useState(false);
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
        setPreparedComments(instagramAccounts.map(() => ""));
        setSelectedAccountIds([]);
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
    setNeedsVerification(false);
    setView("form");

    if (!url.trim()) {
      setError("Enter a valid Instagram post URL.");
      return;
    }
    if (selectedAccountIds.length === 0) {
      setError("Select at least one Instagram account.");
      return;
    }
    if (!likePost && !postComment) {
      setError("Choose at least one action.");
      return;
    }
    if (
      postComment &&
      selectedAccountIds.some(
        (accountId) =>
          !preparedComments[commentAssignments[accountId] ?? 0]?.trim(),
      )
    ) {
      setError("Prepare and assign a comment to every selected account.");
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
        selectedAccountIds,
        selectedAction,
        postComment ? commentText.trim() || "good" : undefined,
        selectedAccountIds.map((accountId) => ({
          accountId,
          commentText:
            preparedComments[commentAssignments[accountId] ?? 0]?.trim() ||
            commentText.trim(),
        })),
      );
      const firstResult = response.results[0];
      if (response.results.some((item) => item.verificationRequired)) {
        setNeedsVerification(true);
        setView("form");
        return;
      }
      setResult({
        url: firstResult?.url ?? url.trim(),
        title: firstResult?.title ?? "Instagram workflow complete",
        message: response.message,
      });
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

  async function handleVerificationSubmit() {
    setError("");

    if (!verificationCode.trim()) {
      setError("Enter the Instagram verification code.");
      return;
    }

    setIsSubmittingVerification(true);
    try {
      await submitInstagramVerificationCode(
        selectedAccountIds[0] ?? "",
        verificationCode.trim(),
      );
      setVerificationCode("");
      setNeedsVerification(false);
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit the Instagram verification code.",
      );
    } finally {
      setIsSubmittingVerification(false);
    }
  }

  async function handleRequestNewCode() {
    setError("");
    setIsRequestingNewCode(true);
    try {
      await requestInstagramVerificationCode(selectedAccountIds[0] ?? "");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request a new Instagram verification code.",
      );
    } finally {
      setIsRequestingNewCode(false);
    }
  }

  if (view === "running") {
    const selectedAccount =
      accounts.find((item) => item.id === selectedAccountIds[0]) ?? null;
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
                  onClick={() =>
                    setSelectedAccountIds(
                      accounts.length ? [accounts[0].id] : [],
                    )
                  }
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
    <div className="mx-auto w-full max-w-6xl">
      <ViewShell
        eyebrow="Instagram / Workflow"
        title="Instagram engagement workflow"
        description="Prepare one post workflow and assign it to the participating Instagram accounts."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="1"
              title="Target post"
              description="Enter the exact URL of the Instagram post to process."
            >
              <label className="block text-sm font-semibold text-slate-700">
                Instagram post URL
                <input
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://www.instagram.com/p/...."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#be185d] focus:ring-4 focus:ring-[#be185d]/10"
                />
              </label>
            </Step>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="2"
              title="Engagement actions"
              description="Choose what each selected Instagram account should do."
            >
              <div className="space-y-3">
                <CheckRow
                  checked={likePost}
                  onChange={() => setLikePost((value) => !value)}
                  label="Like post"
                />
                <CheckRow
                  checked={postComment}
                  onChange={() => setPostComment((value) => !value)}
                  label="Post comment"
                />
              </div>
              {postComment && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold text-[#102a43]">
                    Prepared comments
                  </p>
                  <p className="text-xs text-slate-500">
                    Prepare one comment for each connected Instagram account.
                  </p>
                  {accounts.map((account, index) => (
                    <input
                      key={account.id}
                      value={preparedComments[index] ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        setPreparedComments((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? value : item,
                          ),
                        );
                        if (index === 0) setCommentText(value);
                      }}
                      placeholder={`Comment for ${account.name}`}
                      maxLength={1000}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#be185d]"
                    />
                  ))}
                </div>
              )}
            </Step>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <Step
              number="3"
              title="Accounts"
              description="Select the Instagram accounts that should participate in this workflow."
            >
              <div className="space-y-3">
                {accounts.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                    No connected Instagram accounts
                  </p>
                ) : (
                  accounts.map((account) => {
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
                            className="h-4 w-4 accent-[#be185d]"
                          />
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fce7f3] text-xs font-bold text-[#be185d]">
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
                            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#be185d]"
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
                  })
                )}
              </div>
            </Step>
          </section>

          {needsVerification && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-8">
              <Step
                number="4"
                title="Instagram verification"
                description="Enter the code shown in the open Instagram browser session."
              >
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-amber-900">
                      Instagram verification code
                    </span>
                    <input
                      value={verificationCode}
                      onChange={(event) =>
                        setVerificationCode(event.target.value)
                      }
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                      placeholder="Enter the code sent by Instagram"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleVerificationSubmit()}
                    disabled={isSubmittingVerification}
                    className="mt-4 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-70"
                  >
                    {isSubmittingVerification ? "Submitting..." : "Submit code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRequestNewCode()}
                    disabled={isRequestingNewCode}
                    className="mt-3 rounded-xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-70"
                  >
                    {isRequestingNewCode ? "Requesting..." : "Get a new code"}
                  </button>
                </div>
              </Step>
            </section>
          )}

          {error ? (
            <p className="rounded-xl bg-[#fff0f0] p-4 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isOpening || isLoadingAccounts}
            className="w-full rounded-xl bg-[#dc0000] px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isOpening ? "Starting workflow..." : "Start Workflow"}
          </button>
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
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fce7f3] text-sm font-bold text-[#be185d]">
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
        className="h-4 w-4 accent-[#be185d]"
      />
      {label}
    </label>
  );
}

export default InstagramBrowserView;
