import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SideCart from './components/SideCart';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ClientArea from './pages/ClientArea';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCanceled from './pages/PaymentCanceled';

function App() {
  return (
    <div className="app-container">
      <SideCart />
      <Header />
      
      <main style={{ flex: 1, paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/cliente" element={<ClientArea />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
          <Route path="/pagamento/cancelado" element={<PaymentCanceled />} />
        </Routes>
      </main>

      {/* Footer só é escondido no Admin para melhor uso do espaço vertical da Sidebar, mas podemos manter pra facilitar */}
      <Footer />
    </div>
  );
}

export default App;
