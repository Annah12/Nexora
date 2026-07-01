import Card from "../components/ui/Card"
import Badge from "../components/ui/Badge"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"

const columns = [
  { key: "id", label: "Reference" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Received" },
  { key: "sender", label: "Sender" },
  {
    key: "days",
    label: "Aging",
    render: (val) => {
      const variant = val > 10 ? "error" : val > 5 ? "warning" : "neutral"
      return <Badge variant={variant}>{val} days</Badge>
    },
  },
  {
    key: "action",
    label: "",
    render: (_, row) => (
      <Button variant="secondary" size="sm">Match</Button>
    ),
  },
]

const data = [
  { id: "REF-8832", amount: "$4,200", date: "Jun 22, 2026", sender: "J. Smith", days: 5 },
  { id: "REF-8831", amount: "$2,850", date: "Jun 20, 2026", sender: "M. Johnson", days: 7 },
  { id: "REF-8830", amount: "$9,150", date: "Jun 18, 2026", sender: "R. Davis", days: 9 },
  { id: "REF-8829", amount: "$1,100", date: "Jun 15, 2026", sender: "A. Wilson", days: 12 },
  { id: "REF-8828", amount: "$6,700", date: "Jun 10, 2026", sender: "L. Brown", days: 17 },
]

export default function UnmatchedPayments() {
  return (
    <div className="space-y-6">
      <Card className="bg-amber-50/50 border-amber-200">
        <div className="flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Manual Review Required</h3>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              {data.length} payments could not be automatically matched. Review and assign them to customers to complete reconciliation.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-text">Unmatched Payments</h2>
          <p className="text-xs text-muted mt-0.5">Payments without a matching customer record</p>
        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  )
}
