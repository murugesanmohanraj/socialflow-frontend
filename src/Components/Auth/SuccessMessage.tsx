import { AuthMode } from "./types";

type SuccessMessageProps = {
  mode: AuthMode;
  onBack: () => void;
  resetUrl?: string;
};

export function SuccessMessage({
  mode,
  onBack,
  resetUrl,
}: SuccessMessageProps) {
  const isForgotPassword = mode === "forgot";
  const isRegistering = mode === "register";

  return (
    <div className="rounded-2xl border border-[#b7ebd0] bg-[#effcf5] p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#57cc99] text-lg font-bold text-[#102a43]">
        ✓
      </div>
      <h3 className="text-lg font-semibold text-[#102a43]">
        {isForgotPassword
          ? "Check your inbox"
          : isRegistering
            ? "Account ready to connect"
            : "Sign-in form submitted"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isForgotPassword
          ? "If an account exists for that email, you’ll receive a password reset link shortly."
          : "This frontend flow is ready. Backend authentication will be connected in the next step."}
      </p>
      {resetUrl && (
        <a
          href={resetUrl}
          className="mt-4 block break-all rounded-lg bg-white p-3 text-xs font-semibold text-[#1976d2] underline"
        >
          Open development reset link
        </a>
      )}
      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
      >
        {isForgotPassword ? "Back to sign in" : "Back to form"}
      </button>
    </div>
  );
}
