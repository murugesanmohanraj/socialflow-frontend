import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewShell } from "./AccountsView";

type Notifications = {
  completed: boolean;
  failed: boolean;
  disconnected: boolean;
};

function SettingsView() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Demo Member");
  const [email, setEmail] = useState("demo@gmail.com");
  const [notifications, setNotifications] = useState<Notifications>({
    completed: true,
    failed: true,
    disconnected: false,
  });
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  function updateNotification(key: keyof Notifications) {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordSaved(true);
    setShowPasswordForm(false);
  }

  return (
    <ViewShell
      eyebrow="Settings"
      title="Workspace settings"
      description="Manage your profile, notifications, and connected platforms."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard title="Profile">
          <form onSubmit={saveProfile}>
            <SettingField
              label="Full name"
              value={fullName}
              onChange={(value) => {
                setFullName(value);
                setSaved(false);
              }}
            />
            <SettingField
              label="Email address"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setSaved(false);
              }}
            />
            <div className="mt-5 flex items-center gap-4">
              <button
                type="submit"
                className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
              >
                Save changes
              </button>
              {saved && (
                <span className="text-sm font-semibold text-[#16845b]">
                  Changes saved
                </span>
              )}
            </div>
          </form>
        </SettingsCard>

        <SettingsCard title="Notifications">
          <Toggle
            label="Action completed"
            enabled={notifications.completed}
            onChange={() => updateNotification("completed")}
          />
          <Toggle
            label="Action failed"
            enabled={notifications.failed}
            onChange={() => updateNotification("failed")}
          />
          <Toggle
            label="Account disconnected"
            enabled={notifications.disconnected}
            onChange={() => updateNotification("disconnected")}
          />
        </SettingsCard>

        <SettingsCard title="Connected platforms">
          <PlatformRow
            name="TikTok"
            accounts="5 accounts connected"
            onReconnect={() => navigate("/connect/tiktok")}
          />
          <PlatformRow
            name="YouTube"
            accounts="5 accounts connected"
            onReconnect={() => navigate("/connect/youtube")}
          />
        </SettingsCard>

        <SettingsCard title="Security">
          <p className="text-sm leading-6 text-slate-500">
            Keep your Social Media Manager workspace protected with strong account
            security.
          </p>
          {showPasswordForm ? (
            <form onSubmit={savePassword} className="mt-5 space-y-3">
              <input
                required
                minLength={8}
                type="password"
                placeholder="Current password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
              />
              <input
                required
                minLength={8}
                type="password"
                placeholder="New password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60]"
                >
                  Update password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(true);
                  setPasswordSaved(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#102a43] hover:border-[#2f80ed] hover:text-[#1976d2]"
              >
                Change password
              </button>
              {passwordSaved && (
                <span className="text-sm font-semibold text-[#16845b]">
                  Password updated
                </span>
              )}
            </div>
          )}
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
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-[#102a43]">{title}</h2>
      {children}
    </section>
  );
}

function SettingField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10"
      />
    </label>
  );
}

function Toggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-[#1976d2]" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}

function PlatformRow({
  name,
  accounts,
  onReconnect,
}: {
  name: string;
  accounts: string;
  onReconnect: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#102a43]">{name}</p>
        <p className="mt-1 text-xs text-slate-400">{accounts}</p>
      </div>
      <button
        type="button"
        onClick={onReconnect}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-[#1976d2] hover:bg-[#eaf2fc]"
      >
        Reconnect
      </button>
    </div>
  );
}

export default SettingsView;
