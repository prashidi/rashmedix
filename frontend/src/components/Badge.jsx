export default function Badge({ status }) {
  const styles = {
    in_stock:     'bg-green-100 text-green-700',
    low_stock:    'bg-amber-100 text-amber-700',
    out_of_stock: 'bg-red-100 text-red-700',
  }
  const labels = {
    in_stock:     'In Stock',
    low_stock:    'Low Stock',
    out_of_stock: 'Out of Stock',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}
