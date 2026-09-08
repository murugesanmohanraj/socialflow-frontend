type PasswordFieldProps = {
  showPassword: boolean;
  onToggle: () => void;
  autoComplete: string;
  minLength?: number;
};

export function PasswordField({
  showPassword,
  onToggle,
  autoComplete,
  minLength = 8,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        Password
      </span>
      <div className="relative">
        <input
          required
          minLength={minLength}
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="At least 8 characters"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-[#102a43]"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
