import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClientArea = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Erro ao buscar histórico", err));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{user.name}</h3>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>{user.email}</p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn-primary" style={{ textAlign: 'left', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>Resumo</button>
            <button className="btn-primary" style={{ textAlign: 'left' }}>Meus Pedidos ({orders.length})</button>
            <button className="btn-primary" onClick={() => { logout(); navigate('/'); }} style={{ textAlign: 'left', backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid transparent', marginTop: '1rem' }}>Sair da Conta</button>
          </nav>
        </div>
      </aside>

      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Histórico de Pedidos</h2>

        {orders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Você ainda não realizou nenhum pedido conosco.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Pedido Realizado</p>
                    <p style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total</p>
                    <p style={{ fontWeight: '600' }}>R$ {order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Status</p>
                    <p style={{ fontWeight: '600', color: order.status === 'PENDING' ? '#ff9800' : '#4caf50' }}>{order.status}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Pedido Nº {order.id}</span>
                  </div>
                </div>
                
                {/* Items */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <img src={item.product?.imageUrl} alt={item.product?.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#eee' }} />
                      <div>
                        <h4>{item.product?.name || 'Produto Não Disponível'}</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>R$ {item.price.toFixed(2)} | Qtd: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientArea;
