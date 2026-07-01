export default function TopNav() {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between gap-4 px-8">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search transactions, customers..."
            className="w-full h-9 pl-9 pr-3 bg-border/30 border border-border rounded-lg text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:bg-surface transition-all duration-150"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative p-2 rounded-lg text-muted hover:text-text hover:bg-border/40 transition-all duration-150"
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-2 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}
