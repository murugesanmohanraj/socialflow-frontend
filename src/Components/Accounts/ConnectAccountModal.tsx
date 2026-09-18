import { useNavigate } from "react-router-dom";

type ConnectAccountModalProps = {
  onClose: () => void;
};

function ConnectAccountModal({ onClose }: ConnectAccountModalProps) {
  const navigate = useNavigate();

  function choosePlatform(
    platform: "tiktok" | "youtube" | "facebook" | "instagram",
  ) {
    onClose();
    navigate(`/connect/${platform}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/45 px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-account-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
              New connection
            </p>
            <h2
              id="connect-account-title"
              className="text-2xl font-semibold tracking-tight text-[#102a43]"
            >
              Connect a social account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a platform to securely authorize Social Media Manager.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close connect account dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-[#102a43]"
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PlatformOption
            name="TikTok"
            description="Connect creator accounts"
            mark="♪"
            tone="bg-black text-white"
            onClick={() => choosePlatform("tiktok")}
          />
          <PlatformOption
            name="YouTube"
            description="Connect channels"
            mark="▶"
            tone="bg-[#fff0f0] text-[#dc2626]"
            onClick={() => choosePlatform("youtube")}
          />
          <PlatformOption
            name="Facebook"
            description="Connect browser accounts"
            mark="f"
            tone="bg-[#e8f0fe] text-[#1d4ed8]"
            onClick={() => choosePlatform("facebook")}
          />
          <PlatformOption
            name="Instagram"
            description="Connect browser accounts"
            mark="◎"
            tone="bg-[#fce7f3] text-[#be185d]"
            onClick={() => choosePlatform("instagram")}
          />
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-xl bg-[#f5f7fb] p-4 text-xs leading-5 text-slate-500">
          <span className="mt-0.5 text-[#1976d2]">i</span>
          <p>
            Social Media Manager never asks for your social-media password. You
            will authorize access on the platform&apos;s secure page.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlatformOption({
  name,
  description,
  mark,
  tone,
  onClick,
}: {
  name: string;
  description: string;
  mark: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#2f80ed] hover:shadow-lg"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${tone}`}
      >
        {mark}
      </span>
      <span className="mt-5 block text-base font-semibold text-[#102a43]">
        {name}
      </span>
      <span className="mt-1 block text-sm text-slate-500">{description}</span>
      <span className="mt-5 block text-sm font-semibold text-[#1976d2] group-hover:text-[#102a43]">
        Continue →
      </span>
    </button>
  );
}

export default ConnectAccountModal;
