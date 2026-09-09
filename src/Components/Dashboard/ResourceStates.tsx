type StateAction = {
  label: string;
  onClick: () => void;
};

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#1976d2]" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: StateAction;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf2fc] text-lg text-[#1976d2]">
        —
      </span>
      <h2 className="mt-4 text-lg font-semibold text-[#102a43]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-[#f3c5c5] bg-[#fffafa] p-8 text-center shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0f0] text-lg font-bold text-[#c24141]">
        !
      </span>
      <h2 className="mt-4 text-lg font-semibold text-[#102a43]">
        Unable to load this data
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Something went wrong while reading your workspace. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#102a43] hover:border-[#2f80ed] hover:text-[#1976d2]"
      >
        Try again
      </button>
    </div>
  );
}
