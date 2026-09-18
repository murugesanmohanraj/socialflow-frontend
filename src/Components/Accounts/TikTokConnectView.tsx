import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import { connectTikTokAccount } from "../../services/accountsApi";

function TikTokConnectView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <section className="min-w-0 flex-1 px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
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
                TikTok connect
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

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await connectTikTokAccount(email.trim(), password);
      navigate("/accounts");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to connect TikTok account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return renderPage(
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <button
        type="button"
        onClick={() => navigate("/accounts")}
        className="mb-8 text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
      >
        ← Back to accounts
      </button>

      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9d5ff] text-2xl font-bold text-[#6b21a8]">
          ♪
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
          Manual login
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#102a43] sm:text-3xl">
          Connect TikTok
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Enter the TikTok email and password for the account you want to use
          with Social Media Manager.
        </p>
      </div>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="tiktok-email"
            className="mb-2 block text-sm font-medium text-[#102a43]"
          >
            TikTok email
          </label>
          <input
            id="tiktok-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-3 text-sm text-[#102a43] outline-none transition focus:border-[#1976d2] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="tiktok-password"
            className="mb-2 block text-sm font-medium text-[#102a43]"
          >
            Password
          </label>
          <input
            id="tiktok-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-3 text-sm text-[#102a43] outline-none transition focus:border-[#1976d2] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="Enter your password"
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#6b21a8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#581c87] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Connecting..." : "Connect TikTok"}
        </button>
      </form>
    </div>,
  );
}

export default TikTokConnectView;
