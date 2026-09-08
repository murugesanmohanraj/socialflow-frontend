import { AuthMode } from "./types";

type AuthTabsProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  return (
    <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">
      {(["login", "register"] as AuthMode[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            mode === tab
              ? "bg-white text-[#102a43] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab === "login" ? "Sign in" : "Create account"}
        </button>
      ))}
    </div>
  );
}
