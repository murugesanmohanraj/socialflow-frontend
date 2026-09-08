import { FormEventHandler } from "react";
import { FormField } from "../FormField";
import { PasswordField } from "../PasswordField";

type LoginFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  error: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
};

export function LoginForm({
  onSubmit,
  error,
  showPassword,
  onTogglePassword,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
      />
      <PasswordField
        showPassword={showPassword}
        onToggle={onTogglePassword}
        autoComplete="current-password"
        minLength={6}
      />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-semibold text-[#1976d2] hover:text-[#102a43]"
        >
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#102a43]/15 transition hover:bg-[#183f60] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20"
      >
        Sign in
      </button>
    </form>
  );
}
