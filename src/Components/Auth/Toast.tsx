type ToastProps = {
  type: "success" | "error";
  message: string;
};

export function Toast({ type, message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl sm:right-6 sm:top-6 ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white ${
          type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        {type === "success" ? "✓" : "!"}
      </span>
      {message}
    </div>
  );
}
