import { useState } from "react"
import Card from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import CustomerDetailsModal from "../components/modals/CustomerDetailsModal"

const CUSTOMERS = [
  { id: 1, name: "Acme Corp", email: "billing@acme.com", initials: "AC", virtualAccount: "VA-3842-9101", totalPayments: "$142,300", totalPaymentsValue: 142300, lastPaymentDate: "Jun 25, 2026", lastPaymentRaw: "2026-06-25", status: "Active" },
  { id: 2, name: "Globex Inc", email: "finance@globex.io", initials: "GI", virtualAccount: "VA-2917-4523", totalPayments: "$98,700", totalPaymentsValue: 98700, lastPaymentDate: "Jun 24, 2026", lastPaymentRaw: "2026-06-24", status: "Active" },
  { id: 3, name: "Initech", email: "payments@initech.com", initials: "IN", virtualAccount: "VA-5638-7290", totalPayments: "$54,200", totalPaymentsValue: 54200, lastPaymentDate: "Jun 22, 2026", lastPaymentRaw: "2026-06-22", status: "Pending" },
  { id: 4, name: "Umbrella Co", email: "accounts@umbrella.co", initials: "UC", virtualAccount: "VA-7754-1289", totalPayments: "$212,500", totalPaymentsValue: 212500, lastPaymentDate: "Jun 25, 2026", lastPaymentRaw: "2026-06-25", status: "Active" },
  { id: 5, name: "Hooli", email: "treasury@hooli.com", initials: "HL", virtualAccount: "VA-4421-3367", totalPayments: "$76,800", totalPaymentsValue: 76800, lastPaymentDate: "Jun 21, 2026", lastPaymentRaw: "2026-06-21", status: "Active" },
  { id: 6, name: "Stark Industries", email: "finance@stark.com", initials: "SI", virtualAccount: "VA-9087-6543", totalPayments: "$310,000", totalPaymentsValue: 310000, lastPaymentDate: "Jun 25, 2026", lastPaymentRaw: "2026-06-25", status: "Active" },
  { id: 7, name: "Wayne Enterprises", email: "billing@wayne.com", initials: "WE", virtualAccount: "VA-1234-5678", totalPayments: "$28,400", totalPaymentsValue: 28400, lastPaymentDate: "Jun 10, 2026", lastPaymentRaw: "2026-06-10", status: "Inactive" },
  { id: 8, name: "Cyberdyne Systems", email: "accounts@cyberdyne.com", initials: "CS", virtualAccount: "VA-5566-7788", totalPayments: "$195,000", totalPaymentsValue: 195000, lastPaymentDate: "Jun 23, 2026", lastPaymentRaw: "2026-06-23", status: "Active" },
  { id: 9, name: "Mass Dynamic", email: "hello@massdyn.io", initials: "MD", virtualAccount: "VA-3344-2211", totalPayments: "$67,500", totalPaymentsValue: 67500, lastPaymentDate: "Jun 19, 2026", lastPaymentRaw: "2026-06-19", status: "Pending" },
  { id: 10, name: "OCP", email: "billing@ocp.com", initials: "OC", virtualAccount: "VA-8899-0011", totalPayments: "$143,200", totalPaymentsValue: 143200, lastPaymentDate: "Jun 20, 2026", lastPaymentRaw: "2026-06-20", status: "Active" },
  { id: 11, name: "Soylent Corp", email: "finance@soylent.com", initials: "SC", virtualAccount: "VA-6677-8899", totalPayments: "$42,100", totalPaymentsValue: 42100, lastPaymentDate: "May 28, 2026", lastPaymentRaw: "2026-05-28", status: "Inactive" },
  { id: 12, name: "Tyrell Corp", email: "payments@tyrell.com", initials: "TC", virtualAccount: "VA-1122-3344", totalPayments: "$231,000", totalPaymentsValue: 231000, lastPaymentDate: "Jun 24, 2026", lastPaymentRaw: "2026-06-24", status: "Active" },
]

const statusBadge = {
  Active: "success",
  Pending: "warning",
  Inactive: "neutral",
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Payments" },
]

const filterOptions = ["All", "Active", "Pending", "Inactive"]

const columns = [
  {
    key: "name",
    label: "Customer",
    render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
          {row.initials}
        </div>
        <div>
          <div className="text-sm font-medium text-text">{val}</div>
          <div className="text-xs text-muted mt-0.5">{row.email}</div>
        </div>
      </div>
    ),
  },
  { key: "virtualAccount", label: "Virtual Account" },
  { key: "totalPayments", label: "Total Payments" },
  { key: "lastPaymentDate", label: "Last Payment" },
  {
    key: "status",
    label: "Status",
    render: (val) => <Badge variant={statusBadge[val]}>{val}</Badge>,
  },
  {
    key: "actions",
    label: "",
    render: (_, row) => (
      <Button
        variant="secondary"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={() => setSelectedCustomer(row)}
      >
        View Details
      </Button>
    ),
  },
]

export default function Customers() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const query = search.toLowerCase()

  const filtered = CUSTOMERS
    .filter((c) => {
      if (statusFilter !== "All" && c.status !== statusFilter) return false
      if (!query) return true
      return (
        c.name.toLowerCase().includes(query) ||
        c.virtualAccount.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.lastPaymentRaw.localeCompare(a.lastPaymentRaw)
      if (sortBy === "oldest") return a.lastPaymentRaw.localeCompare(b.lastPaymentRaw)
      return b.totalPaymentsValue - a.totalPaymentsValue
    })

  const activeCount = CUSTOMERS.filter((c) => c.status === "Active").length
  const totalReceived = CUSTOMERS.reduce((s, c) => s + c.totalPaymentsValue, 0)
  const formattedTotal = "$" + totalReceived.toLocaleString("en-US")

  return (
    <>
    <div className="space-y-6">
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  placeholder="Search by name or virtual account..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-border/30 border border-border rounded-lg text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-primary focus:bg-surface transition-all duration-150"
                />
              </div>

              <div className="flex gap-1 p-0.5 bg-border/30 border border-border rounded-lg">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                      statusFilter === opt
                        ? "bg-surface text-text shadow-sm"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 text-sm bg-border/30 border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors duration-150"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <Button size="sm" className="shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Customer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-muted font-medium tracking-wider uppercase">Total Customers</p>
              <p className="text-xl font-semibold text-text mt-1">{CUSTOMERS.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-medium tracking-wider uppercase">Active Virtual Accounts</p>
              <p className="text-xl font-semibold text-text mt-1">{activeCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-medium tracking-wider uppercase">Total Payments Received</p>
              <p className="text-xl font-semibold text-text mt-1">{formattedTotal}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-6">
          {filtered.length > 0 ? (
            <Table columns={columns} data={filtered} />
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-border mb-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-sm font-medium text-text">No customers found</p>
              <p className="text-xs text-muted mt-1">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </>
  )
}
