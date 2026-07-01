import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import TopNav from "./components/layout/TopNav"
import PageContainer from "./components/layout/PageContainer"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import UnmatchedPayments from "./pages/UnmatchedPayments"

const pages = [
  { path: "/", element: <Dashboard />, title: "Dashboard", subtitle: "Overview of your reconciliation activity" },
  { path: "/customers", element: <Customers />, title: "Customers", subtitle: "Manage your merchants and their payment profiles" },
  { path: "/unmatched", element: <UnmatchedPayments />, title: "Unmatched Payments", subtitle: "Payments that need manual reconciliation" },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <TopNav />
                <Routes>
                  {pages.map(({ path, element, title, subtitle }) => (
                    <Route
                      key={path}
                      path={path}
                      element={<PageContainer title={title} subtitle={subtitle}>{element}</PageContainer>}
                    />
                  ))}
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
