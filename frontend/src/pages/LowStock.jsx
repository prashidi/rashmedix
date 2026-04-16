import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { medicineApi } from '../services/api'
import Badge from '../components/Badge'

export default function LowStock() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medicineApi.getLowStock()
      .then(r => setItems(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2.5 rounded-xl">
          <AlertTriangle size={20} className="text-amber-600"/>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Low Stock Alerts</h2>
          <p className="text-slate-500 text-sm mt-0.5">{items.length} items need attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"/>
          </div>
        ) : items.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <Badge status={m.stock_status}/>
              <span className="text-xs text-slate-400">{m.unit}</span>
            </div>
            <h3 className="font-semibold text-slate-800">{m.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{m.generic_name}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current stock</span>
                <span className="font-semibold text-red-600">{m.quantity_in_stock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Reorder level</span>
                <span className="font-medium text-slate-700">{m.reorder_level}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-amber-400 h-1.5 rounded-full"
                  style={{width: `${Math.min(100, (m.quantity_in_stock / m.reorder_level) * 100)}%`}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
