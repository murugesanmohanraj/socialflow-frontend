import { FormEventHandler } from "react";
import { FormField } from "../FormField";

type ForgotPasswordFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  error: string;
  onBackToLogin: () => void;
  isSubmitting: boolean;
};

export function ForgotPasswordForm({
  onSubmit,
  error,
  onBackToLogin,
  isSubmitting,
}: ForgotPasswordFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
      />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button
        type="button"
        onClick={onBackToLogin}
        disabled={isSubmitting}
        className="w-full text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
      >
        Back to sign in
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#102a43]/15 transition hover:bg-[#183f60] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending...
          </span>
        ) : (
          "Send reset link"
        )}
      </button>
    </form>
  );
}
