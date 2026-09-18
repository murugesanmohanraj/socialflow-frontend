import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthBrand, AuthMobileBrand } from "../AuthBrand";
import { Toast } from "../Toast";
import { resetPassword } from "../../../services/authApi";

function ResetPasswordView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (!token) {
      const message = "This password reset link is missing or invalid.";
      setError(message);
      setToast({ type: "error", message });
      return;
    }
    if (newPassword !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      setToast({ type: "error", message });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword({ token, newPassword });
      setIsComplete(true);
      setToast({ type: "success", message: response.message });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset your password.";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <AuthBrand />
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <AuthMobileBrand />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
              Account recovery
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#102a43]">
              {isComplete ? "Password updated" : "Create a new password"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isComplete
                ? "Your password has been changed. You can now sign in with the new password."
                : "Choose a new password with at least 8 characters."}
            </p>

            {isComplete ? (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-8 w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183f60]"
              >
                Back to sign in
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#102a43]">
                    New password
                  </span>
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10 disabled:bg-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#102a43]">
                    Confirm new password
                  </span>
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="Repeat your new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10 disabled:bg-slate-50"
                  />
                </label>
                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#183f60] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating password...
                    </span>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ResetPasswordView;
