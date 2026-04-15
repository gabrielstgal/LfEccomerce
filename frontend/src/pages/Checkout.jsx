import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.selectedSize
        })),
        ...address
      };

      await api.post('/orders/checkout', payload);
      toast.success("Pedido processado! Obrigado pela compra.");
      clearCart();
      navigate('/cliente');
    } catch (err) {
      toast.error(typeof err.response?.data === 'string' ? err.response.data : "Erro ao finalizar pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
      
      {/* Resumo do Pedido */}
      <div style={{ flex: '1 1 300px' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Resumo da Compra</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}/>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Qtd: {item.quantity} {item.selectedSize ? `| Tam: ${item.selectedSize}` : ''}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>R$ {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total a Pagar:</span>
            <span style={{ color: 'var(--color-primary)' }}>R$ {cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Formulário de Endereço */}
      <div style={{ flex: '2 1 400px' }}>
        <h2>Endereço de Entrega</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Preencha os dados abaixo para receber os seus produtos em casa.</p>
        
        <form onSubmit={handleFinalize} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input required name="zipCode" placeholder="CEP" value={address.zipCode} onChange={handleChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input required name="street" placeholder="Rua / Avenida" value={address.street} onChange={handleChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input required name="number" placeholder="Número" value={address.number} onChange={handleChange} style={inputStyle} />
          <input name="complement" placeholder="Complemento (Apto, Bloco)" value={address.complement} onChange={handleChange} style={inputStyle} />
          <input required name="neighborhood" placeholder="Bairro" value={address.neighborhood} onChange={handleChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input required name="city" placeholder="Cidade" value={address.city} onChange={handleChange} style={inputStyle} />
          <input required name="state" placeholder="Estado (UF)" value={address.state} onChange={handleChange} style={inputStyle} />
          
          <div style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
             <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
               {loading ? 'Processando...' : 'Confirmar e Finalizar Compra ($ Fictício)'}
             </button>
          </div>
        </form>
      </div>

    </div>
  );
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid var(--color-border)',
  width: '100%',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)'
};

export default Checkout;
