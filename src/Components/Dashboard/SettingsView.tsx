import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "../../services/accountsApi";
import {
  changeUserPassword,
  getNotificationPreferences,
  getCurrentUser,
  updateNotificationPreferences,
  updateUserProfile,
} from "../../services/authApi";
import { Toast } from "../Auth/Toast";
import { ViewShell } from "./AccountsView";

type Notifications = {
  completed: boolean;
  failed: boolean;
  disconnected: boolean;
};

function SettingsView() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState<Notifications>({
    completed: true,
    failed: true,
    disconnected: false,
  });
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingNotification, setSavingNotification] = useState(false);
  const [platformCounts, setPlatformCounts] = useState({
    TikTok: 0,
    YouTube: 0,
    Facebook: 0,
    Instagram: 0,
  });
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        setFullName(user.name);
        setEmail(user.email);
      })
      .catch(() => setProfileError("Unable to load your profile."));
    getNotificationPreferences()
      .then(({ notifications: preferences }) => setNotifications(preferences))
      .catch(() => setProfileError("Unable to load notification settings."));
    getAccounts()
      .then((accounts) =>
        setPlatformCounts({
          TikTok: accounts.filter((account) => account.platform === "TikTok")
            .length,
          YouTube: accounts.filter((account) => account.platform === "YouTube")
            .length,
          Facebook: accounts.filter(
            (account) => account.platform === "Facebook",
          ).length,
          Instagram: accounts.filter(
            (account) => account.platform === "Instagram",
          ).length,
        }),
      )
      .catch(() => undefined);
  }, []);

  async function updateNotification(key: keyof Notifications) {
    if (savingNotification) return;
    const nextNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(nextNotifications);
    setSaved(false);
    setSavingNotification(true);
    try {
      const { notifications: savedNotifications } =
        await updateNotificationPreferences(nextNotifications);
      setNotifications(savedNotifications);
      showToast("success", "Notification settings saved.");
    } catch (requestError) {
      setNotifications(notifications);
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to save notification settings.";
      showToast("error", message);
    } finally {
      setSavingNotification(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingProfile) return;
    setProfileError("");
    setIsSavingProfile(true);
    try {
      const { user } = await updateUserProfile({ name: fullName });
      setFullName(user.name);
      setSaved(true);
      showToast("success", "Profile changes saved successfully.");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to save your profile.";
      setProfileError(message);
      showToast("error", message);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isChangingPassword) return;
    setPasswordError("");
    setIsChangingPassword(true);
    try {
      await changeUserPassword({ currentPassword, newPassword });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
      showToast("success", "Password updated successfully.");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to update your password.";
      setPasswordError(message);
      showToast("error", message);
    } finally {
      setIsChangingPassword(false);
    }
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} />}
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
                label="Email address (read-only)"
                type="email"
                value={email}
                onChange={setEmail}
                disabled
              />
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    "Save changes"
                  )}
                </button>
                {saved && (
                  <span className="text-sm font-semibold text-[#16845b]">
                    Changes saved
                  </span>
                )}
              </div>
              {profileError && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {profileError}
                </p>
              )}
            </form>
          </SettingsCard>

          <SettingsCard title="Notifications">
            <Toggle
              label="Action completed"
              enabled={notifications.completed}
              onChange={() => updateNotification("completed")}
              disabled={savingNotification}
            />
            <Toggle
              label="Action failed"
              enabled={notifications.failed}
              onChange={() => updateNotification("failed")}
              disabled={savingNotification}
            />
            <Toggle
              label="Account disconnected"
              enabled={notifications.disconnected}
              onChange={() => updateNotification("disconnected")}
              disabled={savingNotification}
            />
          </SettingsCard>

          <SettingsCard title="Connected platforms">
            <PlatformRow
              name="TikTok"
              accounts={`${platformCounts.TikTok} account${platformCounts.TikTok === 1 ? "" : "s"} connected`}
              onReconnect={() => navigate("/connect/tiktok")}
            />
            <PlatformRow
              name="YouTube"
              accounts={`${platformCounts.YouTube} account${platformCounts.YouTube === 1 ? "" : "s"} connected`}
              onReconnect={() => navigate("/connect/youtube")}
            />
            <PlatformRow
              name="Facebook"
              accounts={`${platformCounts.Facebook} account${platformCounts.Facebook === 1 ? "" : "s"} connected`}
              onReconnect={() => navigate("/connect/facebook")}
            />
            <PlatformRow
              name="Instagram"
              accounts={`${platformCounts.Instagram} account${platformCounts.Instagram === 1 ? "" : "s"} connected`}
              onReconnect={() => navigate("/connect/instagram")}
            />
          </SettingsCard>

          <SettingsCard title="Security">
            <p className="text-sm leading-6 text-slate-500">
              Keep your Social Media Manager workspace protected with strong
              account security.
            </p>
            {showPasswordForm ? (
              <form onSubmit={savePassword} className="mt-5 space-y-3">
                <input
                  required
                  minLength={8}
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={isChangingPassword}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
                />
                <input
                  required
                  minLength={8}
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={isChangingPassword}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2f80ed]"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="rounded-xl bg-[#102a43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183f60] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isChangingPassword ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Updating...
                      </span>
                    ) : (
                      "Update password"
                    )}
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
            {passwordError && (
              <p className="mt-3 text-sm font-medium text-red-600">
                {passwordError}
              </p>
            )}
          </SettingsCard>
        </div>
      </ViewShell>
    </>
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
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
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
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#2f80ed] focus:ring-4 focus:ring-[#2f80ed]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
    </label>
  );
}

function Toggle({
  label,
  enabled,
  onChange,
  disabled = false,
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        disabled={disabled}
        className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${enabled ? "bg-[#1976d2]" : "bg-slate-200"}`}
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
