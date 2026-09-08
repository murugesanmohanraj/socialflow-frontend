import { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router-dom";
import socialflowLogo from "../../Assets/Images/socialflow.png";

type DashboardSidebarProps = {
  onLogout: () => void;
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

const navigationItems: { label: string; path: string; icon: NavigationIcon }[] =
  [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Accounts", path: "/accounts", icon: AccountsIcon },
    { label: "Actions", path: "/actions", icon: ActionsIcon },
    { label: "Activity", path: "/activity", icon: ActivityIcon },
    { label: "Settings", path: "/settings", icon: SettingsIcon },
  ];

function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-5 py-6 md:flex md:flex-col">
      <div className="mb-12 flex items-center gap-3 text-lg font-semibold tracking-tight text-[#102a43]">
        <img
          src={socialflowLogo}
          alt="SocialFlow logo"
          className="h-9 w-9 rounded-xl bg-white p-1 object-contain"
        />
        SocialFlow
      </div>

      <nav className="space-y-1">
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${isActive ? "bg-[#eaf2fc] text-[#1976d2]" : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"}`
            }
          >
            <Icon aria-hidden="true" className="mr-3 h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-5">
        <div className="mb-4 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8f5e7] text-xs font-bold text-[#16845b]">
            DM
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#102a43]">
              Demo Member
            </p>
            <p className="truncate text-xs text-slate-400">demo@gmail.com</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
