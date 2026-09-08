import { ViewShell } from "./AccountsView";

function SettingsView() {
  return (
    <ViewShell
      eyebrow="Settings"
      title="Workspace settings"
      description="Manage your profile, notifications, and connected platforms."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard title="Profile">
          <SettingField label="Full name" value="Demo Member" />
          <SettingField label="Email address" value="demo@gmail.com" />
          <button
            type="button"
            className="mt-5 rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
          >
            Save changes
          </button>
        </SettingsCard>
        <SettingsCard title="Notifications">
          <Toggle label="Action completed" enabled />
          <Toggle label="Action failed" enabled />
          <Toggle label="Account disconnected" />
        </SettingsCard>
        <SettingsCard title="Connected platforms">
          <PlatformRow name="TikTok" accounts="5 accounts connected" />
          <PlatformRow name="YouTube" accounts="5 accounts connected" />
        </SettingsCard>
        <SettingsCard title="Security">
          <p className="text-sm leading-6 text-slate-500">
            Keep your SocialFlow workspace protected with strong account
            security.
          </p>
          <button
            type="button"
            className="mt-5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#102a43] hover:border-[#2f80ed] hover:text-[#1976d2]"
          >
            Change password
          </button>
        </SettingsCard>
      </div>
    </ViewShell>
  );
}

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-[#102a43]">{title}</h2>
      {children}
    </section>
  );
}
function SettingField({ label, value }: { label: string; value: string }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        readOnly
        value={value}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
      />
    </label>
  );
}
function Toggle({
  label,
  enabled = false,
}: {
  label: string;
  enabled?: boolean;
}) {
  return (
    <label className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        type="checkbox"
        defaultChecked={enabled}
        className="h-4 w-4 accent-[#1976d2]"
      />
    </label>
  );
}
function PlatformRow({ name, accounts }: { name: string; accounts: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#102a43]">{name}</p>
        <p className="mt-1 text-xs text-slate-400">{accounts}</p>
      </div>
      <span className="rounded-full bg-[#e8f8f0] px-2.5 py-1 text-xs font-semibold text-[#16845b]">
        Connected
      </span>
    </div>
  );
}

export default SettingsView;
