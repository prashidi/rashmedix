import { useEffect, useState } from 'react'
import { Package, AlertTriangle, XCircle, Truck, Tag, TrendingUp } from 'lucide-react'
import { medicineApi } from '../services/api'
import StatCard from '../components/StatCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      medicineApi.getDashboardStats(),
      medicineApi.getLowStock(),
    ]).then(([s, l]) => {
      setStats(s.data)
      setLowStock(l.data.results ?? l.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"/>
    </div>
  )

  const chartData = lowStock.slice(0, 8).map(m => ({
    name: m.name.length > 12 ? m.name.slice(0, 12) + '…' : m.name,
    stock: m.quantity_in_stock,
    reorder: m.reorder_level,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Pharmacy stock overview</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Medicines"   value={stats?.total_medicines}   icon={Package}       color="blue"   />
        <StatCard title="Low Stock Items"   value={stats?.low_stock_count}   icon={AlertTriangle} color="amber"  />
        <StatCard title="Out of Stock"      value={stats?.out_of_stock_count} icon={XCircle}      color="red"    />
        <StatCard title="Suppliers"         value={stats?.total_suppliers}   icon={Truck}         color="purple" />
      </div>

      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" />
            Low Stock Alert — Current vs Reorder Level
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="stock"   name="Current Stock" radius={[4,4,0,0]}>
                {chartData.map((_, i) => <Cell key={i} fill="#f59e0b" />)}
              </Bar>
              <Bar dataKey="reorder" name="Reorder Level" radius={[4,4,0,0]} fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
