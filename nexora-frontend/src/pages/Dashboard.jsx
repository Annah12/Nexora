import Card from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import Table from "../components/ui/Table"

const kpiData = [
  {
    label: "Total Payments",
    value: "$1,284,500",
    trend: "+8.2%",
    trendUp: true,
    subtitle: "Compared to last month",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Reconciled Payments",
    value: "12,847",
    trend: "92.4% match rate",
    trendUp: true,
    subtitle: "of total payments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "Unmatched Payments",
    value: "1,053",
    trend: "7.6% of total",
    trendUp: false,
    subtitle: "needs review",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Total Customers",
    value: "486",
    trend: "+12 this month",
    trendUp: true,
    subtitle: "Active virtual accounts",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

const transactionColumns = [
  { key: "id", label: "Transaction" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  {
    key: "status",
    label: "Status",
    render: (val) => {
      const map = { Matched: "success", Partial: "warning", Unmatched: "error" }
      return <Badge variant={map[val]}>{val}</Badge>
    },
  },
]

const transactionData = [
  { id: "TXN-3842", customer: "Acme Corp", amount: "$12,400", date: "Jun 25, 2026", status: "Matched" },
  { id: "TXN-3841", customer: "Globex Inc", amount: "$8,200", date: "Jun 25, 2026", status: "Matched" },
  { id: "TXN-3840", customer: "Initech", amount: "$3,650", date: "Jun 24, 2026", status: "Partial" },
  { id: "TXN-3839", customer: "Umbrella Co", amount: "$21,000", date: "Jun 24, 2026", status: "Unmatched" },
  { id: "TXN-3838", customer: "Hooli", amount: "$5,400", date: "Jun 23, 2026", status: "Matched" },
  { id: "TXN-3837", customer: "Stark Industries", amount: "$9,800", date: "Jun 23, 2026", status: "Matched" },
  { id: "TXN-3836", customer: "Wayne Enterprises", amount: "$2,100", date: "Jun 22, 2026", status: "Partial" },
  { id: "TXN-3835", customer: "Cyberdyne Systems", amount: "$15,300", date: "Jun 22, 2026", status: "Matched" },
]

const summaryItems = [
  {
    label: "Reconciliation Rate",
    value: "92.4%",
    progress: 92.4,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "Sales Records Generated",
    value: "14,892",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Pending Assignments",
    value: "347",
    accent: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: "Avg Processing Time",
    value: "2.4s",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiData.map((kpi) => (
          <Card key={kpi.label}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-muted tracking-wider uppercase">
                {kpi.label}
              </p>
              <span className={`shrink-0 ${kpi.trendUp ? "text-emerald-500" : "text-amber-500"}`}>
                {kpi.icon}
              </span>
            </div>
            <p className="text-[28px] font-semibold tracking-tight text-text mt-2">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  kpi.trendUp ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {kpi.trendUp ? (
                    <path d="m18 15-6-6-6 6" />
                  ) : (
                    <path d="m6 9 6 6 6-6" />
                  )}
                </svg>
                {kpi.trend}
              </span>
              <span className="text-xs text-muted">{kpi.subtitle}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-text">Recent Transactions</h2>
                <p className="text-xs text-muted mt-0.5">Latest reconciliation activity</p>
              </div>
            </div>
            <Table columns={transactionColumns} data={transactionData} />
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-base font-semibold text-text mb-5">Reconciliation Summary</h2>
            <div className="space-y-5">
              {summaryItems.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-muted">{item.icon}</span>
                      <span className="text-sm text-muted">{item.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.accent ? "text-amber-600" : "text-text"}`}>
                      {item.value}
                    </span>
                  </div>
                  {item.progress != null && (
                    <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
