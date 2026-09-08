type FormFieldProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  minLength?: number;
};

export function FormField({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  minLength,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
      />
    </label>
  );
}
