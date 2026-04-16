import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { medicineApi, categoryApi, supplierApi } from '../services/api'
import Badge from '../components/Badge'

const empty = {
  name:'', generic_name:'', category:'', supplier:'',
  unit:'tablet', quantity_in_stock:0, reorder_level:10,
  unit_price:'', expiry_date:'', batch_number:'', description:''
}

export default function Medicines() {
  const [medicines, setMedicines]   = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers]   = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(empty)
  const [editing, setEditing]       = useState(null)
  const [adjustModal, setAdjustModal] = useState(null)
  const [adjustQty, setAdjustQty]   = useState(0)
  const [adjustType, setAdjustType] = useState('restock')

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      medicineApi.getAll(search),
      categoryApi.getAll(),
      supplierApi.getAll(),
    ]).then(([m, c, s]) => {
      setMedicines(m.data.results ?? m.data)
      setCategories(c.data.results ?? c.data)
      setSuppliers(s.data.results ?? s.data)
    }).finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit   = (m)  => { setForm(m);    setEditing(m.id); setModal(true) }

  const save = async () => {
    editing
      ? await medicineApi.update(editing, form)
      : await medicineApi.create(form)
    setModal(false); load()
  }

  const remove = async (id) => {
    if (confirm('Delete this medicine?')) {
      await medicineApi.delete(id); load()
    }
  }

  const doAdjust = async () => {
    await medicineApi.adjustStock(adjustModal, {
      quantity: adjustQty, transaction_type: adjustType
    })
    setAdjustModal(null); load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medicines</h2>
          <p className="text-slate-500 text-sm mt-1">{medicines.length} items in inventory</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus size={16}/> Add Medicine
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          placeholder="Search medicines..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
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
                {['Name','Category','Stock','Status','Price','Expiry','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {medicines.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.generic_name}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{m.category_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-700">{m.quantity_in_stock}</span>
                    <span className="text-slate-400 text-xs"> {m.unit}</span>
                  </td>
                  <td className="px-4 py-3"><Badge status={m.stock_status}/></td>
                  <td className="px-4 py-3 text-slate-600">€{m.unit_price}</td>
                  <td className="px-4 py-3 text-slate-500">{m.expiry_date ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setAdjustModal(m.id); setAdjustQty(0) }}
                        className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-500 transition-colors" title="Adjust stock">
                        <ArrowUpDown size={14}/>
                      </button>
                      <button onClick={() => openEdit(m)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors">
                        <Pencil size={14}/>
                      </button>
                      <button onClick={() => remove(m.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">{editing ? 'Edit Medicine' : 'Add Medicine'}</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                ['name','Name','text'],
                ['generic_name','Generic Name','text'],
                ['batch_number','Batch Number','text'],
                ['unit_price','Unit Price (€)','number'],
                ['quantity_in_stock','Quantity in Stock','number'],
                ['reorder_level','Reorder Level','number'],
                ['expiry_date','Expiry Date','date'],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                  <input type={type}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={form[key] ?? ''} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))}>
                  {['tablet','capsule','ml','mg','box','vial'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={form.category ?? ''} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                  <option value="">— Select —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Supplier</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={form.supplier ?? ''} onChange={e => setForm(f => ({...f, supplier: e.target.value}))}>
                  <option value="">— Select —</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={form.description ?? ''} onChange={e => setForm(f => ({...f, description: e.target.value}))}/>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={save}
                className="px-4 py-2 rounded-xl text-sm bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors">
                {editing ? 'Save Changes' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Adjust Stock</h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Transaction Type</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={adjustType} onChange={e => setAdjustType(e.target.value)}>
                {['restock','dispensed','adjustment','expired'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Quantity (use negative to reduce)</label>
              <input type="number"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={adjustQty} onChange={e => setAdjustQty(parseInt(e.target.value))}/>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setAdjustModal(null)}
                className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={doAdjust}
                className="px-4 py-2 rounded-xl text-sm bg-sky-500 hover:bg-sky-600 text-white font-medium">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
