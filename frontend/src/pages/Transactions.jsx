import { useState, useEffect } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { transactionApi } from '../services/api'

const typeColors = {
  restock:    'bg-green-100 text-green-700',
  dispensed:  'bg-blue-100 text-blue-700',
  adjustment: 'bg-amber-100 text-amber-700',
  expired:    'bg-red-100 text-red-700',
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionApi.getAll()
      .then(r => setTransactions(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Stock Transactions</h2>
        <p className="text-slate-500 text-sm mt-1">Full audit trail of all stock movements</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"/>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Medicine','Type','Quantity','Notes','Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{t.medicine_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[t.transaction_type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {t.transaction_type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${t.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.quantity > 0 ? '+' : ''}{t.quantity}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{t.notes || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(t.created_at).toLocaleDateString('en-IE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
