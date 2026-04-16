import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard    from './pages/Dashboard'
import Medicines    from './pages/Medicines'
import Suppliers    from './pages/Suppliers'
import Transactions from './pages/Transactions'
import LowStock     from './pages/LowStock'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"             element={<Dashboard/>}    />
          <Route path="/medicines"    element={<Medicines/>}    />
          <Route path="/suppliers"    element={<Suppliers/>}    />
          <Route path="/transactions" element={<Transactions/>} />
          <Route path="/low-stock"    element={<LowStock/>}     />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
