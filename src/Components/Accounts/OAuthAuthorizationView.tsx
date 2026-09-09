import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStoredAccount } from "../../utils/socialflowStorage";

type OAuthAuthorizationViewProps = {
  platform: "tiktok" | "youtube";
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
};

function OAuthAuthorizationView({ platform }: OAuthAuthorizationViewProps) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const details = platformDetails[platform];

  function authorizeAccount() {
    const isTikTok = platform === "tiktok";
    addStoredAccount({
      id: `${platform}-${Date.now()}`,
      name: isTikTok ? "New TikTok account" : "New YouTube channel",
      platform: isTikTok ? "TikTok" : "YouTube",
      status: "Connected",
      lastActive: "Just now",
      initials: isTikTok ? "TT" : "YT",
      color: isTikTok ? "bg-black text-white" : "bg-[#fff0f0] text-[#dc2626]",
      connected: "Today",
    });
    setAuthorized(true);
  }

  if (authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-6 sm:px-5 sm:py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#b7ebd0] bg-white p-5 text-center shadow-sm sm:p-8">
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
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-6 sm:px-5 sm:py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
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
              <li
                key={permission}
                className="flex gap-3 text-sm text-slate-600"
              >
                <span className="text-[#16845b]">✓</span>
                {permission}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={authorizeAccount}
          className="mt-7 w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          Continue with {details.name}
        </button>
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          This is a frontend authorization preview. Real OAuth credentials will
          be connected through the backend.
        </p>
      </div>
    </main>
  );
}

export default OAuthAuthorizationView;
