import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Truck } from 'lucide-react'
import { supplierApi } from '../services/api'

const empty = { name:'', contact_email:'', phone:'', address:'' }

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(empty)
  const [editing, setEditing]     = useState(null)

  const load = () => supplierApi.getAll().then(r => setSuppliers(r.data.results ?? r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(empty); setEditing(null); setModal(true) }
  const openEdit   = (s)  => { setForm(s);   setEditing(s.id); setModal(true) }

  const save = async () => {
    editing ? await supplierApi.update(editing, form) : await supplierApi.create(form)
    setModal(false); load()
  }

  const remove = async (id) => {
    if (confirm('Delete supplier?')) { await supplierApi.delete(id); load() }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Suppliers</h2>
          <p className="text-slate-500 text-sm mt-1">{suppliers.length} registered suppliers</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus size={16}/> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-purple-100 p-2 rounded-xl">
                <Truck size={18} className="text-purple-600"/>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)}
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors">
                  <Pencil size={14}/>
                </button>
                <button onClick={() => remove(s.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800">{s.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{s.contact_email}</p>
            {s.phone && <p className="text-xs text-slate-400 mt-0.5">{s.phone}</p>}
            {s.address && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{s.address}</p>}
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">{editing ? 'Edit Supplier' : 'Add Supplier'}</h3>
            {[['name','Name'],['contact_email','Email'],['phone','Phone']].map(([key,label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={form[key] ?? ''} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}/>
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
              <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.address ?? ''} onChange={e => setForm(f => ({...f, address: e.target.value}))}/>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={save}
                className="px-4 py-2 rounded-xl text-sm bg-sky-500 hover:bg-sky-600 text-white font-medium">
                {editing ? 'Save' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
