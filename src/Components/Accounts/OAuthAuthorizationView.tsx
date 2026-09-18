import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import {
  getTikTokAuthorizationUrl,
  getYouTubeAuthorizationUrl,
} from "../../services/oauthApi";

type OAuthAuthorizationViewProps = {
  platform: "tiktok" | "youtube" | "facebook" | "instagram";
};

const platformDetails = {
  tiktok: {
    name: "TikTok",
    mark: "♪",
    tone: "bg-black text-white",
    permissions: [
      "View authorized profile information",
      "Open supported content",
      "Track action results",
    ],
  },
  youtube: {
    name: "YouTube",
    mark: "▶",
    tone: "bg-[#fff0f0] text-[#dc2626]",
    permissions: [
      "View channel information",
      "Open supported video content",
      "Track action results",
    ],
  },
  facebook: {
    name: "Facebook",
    mark: "f",
    tone: "bg-[#e8f0fe] text-[#1d4ed8]",
    permissions: [
      "View public profile information",
      "Open supported public content",
      "Track action results",
    ],
  },
  instagram: {
    name: "Instagram",
    mark: "◎",
    tone: "bg-[#fce7f3] text-[#be185d]",
    permissions: [
      "View profile information",
      "Open supported public content",
      "Track action results",
    ],
  },
};

function OAuthAuthorizationView({ platform }: OAuthAuthorizationViewProps) {
  const navigate = useNavigate();
  const [authorized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const details = platformDetails[platform];

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
                {details.name} connect
              </span>
              <span className="h-11 w-11" />
            </div>
            {content}
          </section>
        </div>
      </main>
    );
  }

  async function authorizeAccount() {
    setIsStarting(true);
    setError("");
    try {
      const authorizationUrl =
        platform === "youtube"
          ? await getYouTubeAuthorizationUrl()
          : await getTikTokAuthorizationUrl();
      window.location.assign(authorizationUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `Unable to start ${details.name} authorization.`,
      );
      setIsStarting(false);
    }
  }

  if (authorized) {
    return renderPage(
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#b7ebd0] bg-white p-5 text-center shadow-sm sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f5e7] text-2xl font-bold text-[#16845b]">
          ✓
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#16845b]">
          Connection complete
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#102a43] sm:text-3xl">
          {details.name} is connected
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your account is ready to use with supported Social Media Manager
          actions.
        </p>
        <button
          type="button"
          onClick={() => navigate("/accounts")}
          className="mt-7 w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          Return to accounts
        </button>
      </div>,
    );
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
        <span
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${details.tone}`}
        >
          {details.mark}
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
          Secure authorization
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#102a43] sm:text-3xl">
          Connect {details.name}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Authorize Social Media Manager to work with your {details.name}{" "}
          account. You&apos;ll be redirected to the platform&apos;s secure
          authorization page.
        </p>
      </div>
      <div className="mt-6 rounded-xl bg-[#f5f7fb] p-4 sm:mt-8 sm:p-5">
        <p className="text-sm font-semibold text-[#102a43]">
          Social Media Manager will be able to:
        </p>
        <ul className="mt-4 space-y-3">
          {details.permissions.map((permission) => (
            <li key={permission} className="flex gap-3 text-sm text-slate-600">
              <span className="text-[#16845b]">✓</span>
              {permission}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={authorizeAccount}
        disabled={isStarting}
        className="mt-7 w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183f60] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isStarting
          ? `Opening ${details.name}...`
          : `Continue with ${details.name}`}
      </button>
      {error && (
        <p className="mt-3 text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        You will authorize access on {details.name}&apos;s secure authorization
        page.
      </p>
    </div>,
  );
}

export default OAuthAuthorizationView;
