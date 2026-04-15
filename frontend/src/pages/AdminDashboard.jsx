import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // ANALYTICS, PRODUCTS, ORDERS
  
  // Products Data
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState('');

  // Orders Data
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !isAdmin) {
      toast.error("Administradores apenas.");
      navigate('/');
      return;
    }
    loadProducts();
    loadOrders();
  }, [user, isAdmin, navigate]);

  const loadProducts = () => {
    api.get('/products/search?size=100').then(res => setProducts(res.data.content || res.data)).catch(err => console.error(err));
  };

  const loadOrders = () => {
    api.get('/orders/all').then(res => setOrders(res.data)).catch(err => console.error(err));
  };

  // --- Products Logic ---
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name, category, description: 'Detalhes da peça sob consulta.',
        price: parseFloat(price), stockAmount: parseInt(stock),
        imageUrl: imageUrl || 'https://via.placeholder.com/400x500?text=LF+Clothing',
        sizes: sizes ? sizes.split(',').map(s => s.trim()) : []
      });
      toast.success("Produto Cadastrado!");
      setName(''); setCategory(''); setPrice(''); setStock(''); setImageUrl(''); setSizes('');
      loadProducts();
    } catch(err) {
      toast.error("Falha ao salvar produto.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Remover este produto?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Produto deletado!");
      loadProducts();
    } catch(err) {
      toast.error("Não foi possível excluir (Talvez tenha pedidos atrelados a ele).");
    }
  };

  // --- Orders Logic ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Status Atualizado!");
      loadOrders(); // recarrega
    } catch(err) {
      toast.error("Erro ao atualizar status.");
    }
  };

  // --- Analytics Logic ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const allItems = orders.flatMap(o => o.items);
  
  const getTop = (keyExtractor) => {
    const counts = allItems.reduce((acc, item) => {
      const key = keyExtractor(item);
      if(key) acc[key] = (acc[key] || 0) + item.quantity;
      return acc;
    }, {});
    return Object.entries(counts).sort((a,b) => b[1]-a[1])[0] || ['Nenhum', 0];
  };

  const [topSize, topSizeCount] = getTop(item => item.size);
  const [topProduct, topProductCount] = getTop(item => item.product?.name);
  const [topCategory, topCategoryCount] = getTop(item => item.product?.category);

  if (!isAdmin) return null;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#fcfcfc' }}>
      {/* Admin Sidebar */}
      <aside style={{ width: '260px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>LF</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Painel Lojista</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Admin Workspace</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => setActiveTab('ANALYTICS')} style={{ ...tabStyle, ...(activeTab === 'ANALYTICS' ? activeTabStyle : {}) }}>📊 Visão Geral</button>
          <button onClick={() => setActiveTab('ORDERS')} style={{ ...tabStyle, ...(activeTab === 'ORDERS' ? activeTabStyle : {}) }}>📦 Pedidos {orders.filter(o=>o.status==='PENDING').length > 0 && <span style={{backgroundColor:'red', color:'white', borderRadius:'12px', padding:'2px 6px', fontSize:'0.7rem'}}>{orders.filter(o=>o.status==='PENDING').length}</span>}</button>
          <button onClick={() => setActiveTab('PRODUCTS')} style={{ ...tabStyle, ...(activeTab === 'PRODUCTS' ? activeTabStyle : {}) }}>👕 Produtos</button>
        </nav>
      </aside>

      {/* Admin Main Window */}
      <div style={{ flex: 1, padding: '3rem 5%', overflowY: 'auto' }}>
        
        {/* --- TAB: ANALYTICS --- */}
        {activeTab === 'ANALYTICS' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Desempenho da Loja</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              
              <div style={kpiCardStyle}>
                <p style={kpiLabelStyle}>Faturamento Total</p>
                <h3 style={kpiValueStyle}>R$ {totalRevenue.toFixed(2)}</h3>
                <div style={{ marginTop: '1rem', height: '4px', background: 'linear-gradient(90deg, #4caf50, #81c784)', borderRadius: '2px' }}></div>
              </div>

              <div style={kpiCardStyle}>
                <p style={kpiLabelStyle}>Peça Campeã</p>
                <h3 style={{ ...kpiValueStyle, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topProduct}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{topProductCount} unidades vendidas</p>
              </div>

              <div style={kpiCardStyle}>
                <p style={kpiLabelStyle}>Tamanho Mais Escasso</p>
                <h3 style={kpiValueStyle}>{topSize}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>O tamanho mais estocado nas sacolas ({topSizeCount} unid.)</p>
              </div>

              <div style={kpiCardStyle}>
                <p style={kpiLabelStyle}>Categoria Forte</p>
                <h3 style={{ ...kpiValueStyle, fontSize: '1.5rem' }}>{topCategory}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>A tendência do momento ({topCategoryCount} unid.)</p>
              </div>

            </div>
          </div>
        )}

        {/* --- TAB: ORDERS --- */}
        {activeTab === 'ORDERS' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Gestão de Pedidos</h2>
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>ID</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Cliente</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Data</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Valor</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Ação Rápida</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 'bold' }}>#{o.id}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div>{o.user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{o.user.email}</div>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: '600' }}>R$ {o.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                          backgroundColor: o.status === 'PENDING' ? '#fff3e0' : (o.status==='DELIVERED' ? '#e8f5e9' : '#e3f2fd'),
                          color: o.status === 'PENDING' ? '#ff9800' : (o.status==='DELIVERED' ? '#4caf50' : '#2196f3')
                        }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <select 
                          value={o.status} 
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                        >
                          <option value="PENDING">Pendente</option>
                          <option value="PAID">Pago</option>
                          <option value="SHIPPED">Enviado</option>
                          <option value="DELIVERED">Entregue</option>
                          <option value="CANCELED">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Nenhum pedido recebido ainda.</div>}
            </div>
          </div>
        )}

        {/* --- TAB: PRODUCTS --- */}
        {activeTab === 'PRODUCTS' && (
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Catálogo e Estoque</h2>
            {/* Cadastro Novo */}
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Adicionar Novo Produto</h3>
              <form onSubmit={handleCreateProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <input type="text" placeholder="Nome da Peça" value={name} onChange={e=>setName(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder="Categoria (Camisas, Calças...)" value={category} onChange={e=>setCategory(e.target.value)} required style={inputStyle} />
                <input type="number" step="0.01" placeholder="Preço (Ex: 199.90)" value={price} onChange={e=>setPrice(e.target.value)} required style={inputStyle} />
                <input type="number" placeholder="Estoque Disponível" value={stock} onChange={e=>setStock(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder="Tamanhos (ex: P, M, G)" value={sizes} onChange={e=>setSizes(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="URL da Foto (Unsplash/Imgur)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} style={{...inputStyle, gridColumn: '1 / -1'}} />
                <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Lançar Produto</button>
              </form>
            </div>

            {/* Tabela de Produtos */}
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Produto</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Cat/Preço</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Estoque</th>
                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={p.imageUrl} alt="" style={{width: 40, height: 40, borderRadius: 4, objectFit: 'cover'}}/>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div>{p.category}</div>
                        <div style={{ fontSize:'0.85rem', color: 'var(--color-text-muted)' }}>R$ {p.price?.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', color: p.stockAmount > 0 ? '#4caf50' : 'red' }}>{p.stockAmount} unid.</td>
                      <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ border: 'none', background: 'transparent', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const inputStyle = { padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' };
const tabStyle = { padding: '1rem 1.5rem', textAlign: 'left', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: '600', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const activeTabStyle = { background: 'var(--color-primary)', color: 'white' };
const kpiCardStyle = { backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const kpiLabelStyle = { color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' };
const kpiValueStyle = { fontSize: '2.5rem', margin: 0, color: 'var(--color-text)' };

export default AdminDashboard;
