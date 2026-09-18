import { ComponentType, SVGProps, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import socialflowLogo from "../../Assets/Images/socialflow.png";
import { getCurrentUser } from "../../services/authApi";

type DashboardSidebarProps = {
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

const DashboardIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const AccountsIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 11a3 3 0 1 0 0-6" />
    <path d="M17 14.5a5.5 5.5 0 0 1 3.5 5" />
  </svg>
);

const ActionsIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m10 8 5 4-5 4V8Z" />
  </svg>
);

const YouTubeIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <path d="m10 9 5 3-5 3V9Z" />
  </svg>
);

const TikTokIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3-3.46" />
    <path d="M14 4c.5 2.2 1.8 3.5 4 4" />
  </svg>
);

const ActivityIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path d="M3 12h4l2.2-6 4.1 12 2.2-6H21" />
  </svg>
);

const SettingsIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.6H21a1.7 1.7 0 0 0-1.6 1Z" />
  </svg>
);

const FacebookIcon: NavigationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" />
  </svg>
);

const InstagramIcon: NavigationIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const navigationItems: { label: string; path: string; icon: NavigationIcon }[] =
  [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Accounts", path: "/accounts", icon: AccountsIcon },
    { label: "YouTube Workflow", path: "/youtube-workflow", icon: YouTubeIcon },
    {
      label: "Facebook Workflow",
      path: "/facebook-browser",
      icon: FacebookIcon,
    },
    {
      label: "Instagram Workflow",
      path: "/instagram-browser",
      icon: InstagramIcon,
    },
    { label: "TikTok Workflow", path: "/tiktok-workflow", icon: TikTokIcon },
    { label: "Actions", path: "/actions", icon: ActionsIcon },
    { label: "Activity", path: "/activity", icon: ActivityIcon },
    { label: "Settings", path: "/settings", icon: SettingsIcon },
  ];

function DashboardSidebar({
  onLogout,
  isMobileOpen = false,
  onCloseMobile = () => undefined,
}: DashboardSidebarProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    getCurrentUser()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null));
  }, []);

  const displayName = user?.name ?? "Loading profile...";
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "...";

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#102a43]/40 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-all duration-200 ${
          isMobileOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } md:sticky md:top-0 md:translate-x-0 md:opacity-100 md:z-auto md:h-screen md:max-h-screen md:overflow-hidden md:inset-auto md:left-auto md:transform-none`}
      >
        <div className="mb-12 flex items-center gap-3 text-lg font-semibold tracking-tight text-[#102a43]">
          <img
            src={socialflowLogo}
            alt="Social Media Manager logo"
            className="h-9 w-9 rounded-xl bg-white p-1 object-contain"
          />
          Social Media Manager
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto text-2xl font-light text-slate-400 hover:text-[#102a43] md:hidden"
          >
            ×
          </button>
        </div>

        <nav className="space-y-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${isActive ? "bg-[#eaf2fc] text-[#1976d2]" : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"}`
              }
              onClick={onCloseMobile}
            >
              <Icon aria-hidden="true" className="mr-3 h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8f5e7] text-xs font-bold text-[#16845b]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#102a43]">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email ?? "Loading..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLogout?.()}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
