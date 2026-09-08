import { FormEventHandler } from "react";
import { FormField } from "../FormField";
import { PasswordField } from "../PasswordField";

type RegisterFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  error: string;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function RegisterForm({
  onSubmit,
  error,
  showPassword,
  onTogglePassword,
}: RegisterFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField
        label="Full name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Alex Morgan"
      />
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
        autoComplete="new-password"
      />
      <FormField
        label="Confirm password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Repeat your password"
        minLength={8}
      />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-xl bg-[#102a43] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#102a43]/15 transition hover:bg-[#183f60] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20"
      >
        Create account
      </button>
    </form>
  );
}
