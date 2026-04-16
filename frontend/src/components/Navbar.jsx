import { Link, useLocation } from 'react-router-dom'
import { Pill, LayoutDashboard, Package, Truck, ArrowLeftRight, AlertTriangle } from 'lucide-react'

const links = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/medicines',    label: 'Medicines',    icon: Pill },
  { to: '/suppliers',    label: 'Suppliers',    icon: Truck },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/low-stock',    label: 'Low Stock',    icon: AlertTriangle },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-xl">
            <Pill size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">RashMedix</h1>
            <p className="text-slate-400 text-xs">Pharmacy Stock</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs text-center">RashMedix v1.0</p>
      </div>
    </aside>
  )
}
