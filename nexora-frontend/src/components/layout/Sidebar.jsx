import { NavLink } from "react-router-dom"

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { to: "/customers", label: "Customers", icon: "Users" },
  { to: "/unmatched", label: "Unmatched Payments", icon: "Crosshair" },
]

const icons = {
  LayoutDashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Crosshair: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  ),
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col shrink-0 sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Nexora">
          <rect x="2" y="2" width="24" height="24" rx="6" fill="#C8A27A" />
          <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-base font-semibold tracking-tight text-text">
          nexora
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-muted hover:text-text hover:bg-border/40"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <span className="shrink-0">{icons[icon]}</span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-border/40 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text truncate">Jane Doe</div>
            <div className="text-xs text-muted truncate">jane@merchant.com</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </aside>
  )
}
