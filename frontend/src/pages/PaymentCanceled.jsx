import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

/**
 * Página exibida quando o usuário cancela o pagamento no AbacatePay
 * e é redirecionado de volta para a loja.
 */
const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f87171, #dc2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.2rem',
          boxShadow: '0 0 24px #dc262655',
        }}>
          ✕
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Pagamento Cancelado</h1>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Você cancelou o pagamento. Seu pedido ainda está pendente — você pode tentar novamente.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ padding: '0.9rem', borderRadius: '10px', width: '100%', cursor: 'pointer' }}
          >
            Tentar Novamente
          </button>
          <Link to="/" style={{
            display: 'block',
            padding: '0.9rem',
            borderRadius: '10px',
            textDecoration: 'none',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}>
            Voltar à Loja
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceled;
