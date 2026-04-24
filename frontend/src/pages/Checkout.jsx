import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createPayment } from '../services/paymentService';
import { toast } from 'react-toastify';

// Ícones SVG inline para Pix e Cartão
const PixIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M11.354 2.646a.9.9 0 0 1 1.274 0l2.196 2.196a.9.9 0 0 0 .638.264h2.788a.9.9 0 0 1 .9.9v2.788a.9.9 0 0 0 .264.638l2.196 2.196a.9.9 0 0 1 0 1.274l-2.196 2.196a.9.9 0 0 0-.264.638v2.788a.9.9 0 0 1-.9.9h-2.788a.9.9 0 0 0-.638.264l-2.196 2.196a.9.9 0 0 1-1.274 0l-2.196-2.196a.9.9 0 0 0-.638-.264H5.732a.9.9 0 0 1-.9-.9v-2.788a.9.9 0 0 0-.264-.638L2.372 12.9a.9.9 0 0 1 0-1.274l2.196-2.196a.9.9 0 0 0 .264-.638V5.006a.9.9 0 0 1 .9-.9h2.788a.9.9 0 0 0 .638-.264z"/>
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PIX');

  const [address, setAddress] = useState({
    street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zipCode: ''
  });

  const [customerData, setCustomerData] = useState({
    cpf: '', phone: ''
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio!');
      return;
    }

    setLoading(true);
    try {
      const { paymentUrl } = await createPayment(
        cartItems,
        address,
        customerData.cpf,
        customerData.phone
      );

      clearCart();
      // Redireciona para o checkout do AbacatePay (Pix + Cartão)
      window.location.href = paymentUrl;

    } catch (err) {
      toast.error(
        typeof err.response?.data === 'string'
          ? err.response.data
          : 'Erro ao gerar cobrança. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>

      {/* ── Resumo do Pedido ── */}
      <div style={{ flex: '1 1 300px' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Resumo da Compra
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Qtd: {item.quantity}{item.selectedSize ? ` | Tam: ${item.selectedSize}` : ''}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--color-primary)' }}>R$ {cartTotal.toFixed(2)}</span>
          </div>

          {/* ── Seleção do Método de Pagamento ── */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Forma de Pagamento
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { id: 'PIX', label: 'Pix', icon: <PixIcon />, color: '#32BCAD' },
                { id: 'CREDIT_CARD', label: 'Cartão', icon: <CardIcon />, color: '#6366f1' }
              ].map(({ id, label, icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  style={{
                    flex: 1,
                    padding: '1rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: paymentMethod === id ? `2px solid ${color}` : '2px solid var(--color-border)',
                    borderRadius: '10px',
                    background: paymentMethod === id ? `${color}18` : 'var(--color-surface)',
                    color: paymentMethod === id ? color : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: paymentMethod === id ? '700' : '400',
                    fontSize: '0.85rem',
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              Você escolherá o método no checkout seguro do AbacatePay ↗
            </p>
          </div>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div style={{ flex: '2 1 400px' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Endereço de Entrega</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Preencha seus dados para finalizar o pedido via AbacatePay.
        </p>

        <form onSubmit={handleFinalize}>
          {/* Endereço */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <input required name="zipCode"       placeholder="CEP"                    value={address.zipCode}       onChange={handleAddressChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            <input required name="street"        placeholder="Rua / Avenida"          value={address.street}        onChange={handleAddressChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            <input required name="number"        placeholder="Número"                 value={address.number}        onChange={handleAddressChange} style={inputStyle} />
            <input          name="complement"    placeholder="Complemento"            value={address.complement}    onChange={handleAddressChange} style={inputStyle} />
            <input required name="neighborhood"  placeholder="Bairro"                 value={address.neighborhood}  onChange={handleAddressChange} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            <input required name="city"          placeholder="Cidade"                 value={address.city}          onChange={handleAddressChange} style={inputStyle} />
            <input required name="state"         placeholder="Estado (UF)"            value={address.state}         onChange={handleAddressChange} style={inputStyle} />
          </div>

          {/* Dados do cliente para o AbacatePay */}
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Dados para o Pagamento</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <input
              required
              name="cpf"
              placeholder="CPF (somente números)"
              value={customerData.cpf}
              onChange={handleCustomerChange}
              maxLength={11}
              pattern="\d{11}"
              title="Digite os 11 dígitos do CPF sem pontos ou traços"
              style={inputStyle}
            />
            <input
              required
              name="phone"
              placeholder="Telefone (ex: 11999999999)"
              value={customerData.phone}
              onChange={handleCustomerChange}
              maxLength={11}
              style={inputStyle}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1.1rem',
              fontSize: '1.05rem',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              borderRadius: '10px',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: '18px', height: '18px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Gerando cobrança...
              </>
            ) : (
              <>🔒 Pagar com AbacatePay</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
            Você será redirecionado para o ambiente seguro do AbacatePay para concluir o pagamento.
          </p>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  padding: '2rem',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  width: '100%',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};

export default Checkout;
