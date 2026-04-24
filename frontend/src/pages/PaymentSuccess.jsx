import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

/**
 * Página exibida após o usuário concluir o pagamento no AbacatePay.
 * A URL de retorno configurada no backend é: /pagamento/sucesso?orderId=<id>
 */
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  // Redireciona automaticamente para área do cliente após 8 segundos
  useEffect(() => {
    const timer = setTimeout(() => navigate('/cliente'), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

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
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        {/* Ícone de sucesso animado */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #32BCAD, #1a9b8e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.2rem',
          boxShadow: '0 0 24px #32BCAD55',
          animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>
          Pagamento Confirmado!
        </h1>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
          Seu pedido foi recebido e está sendo processado pela nossa equipe.
        </p>

        {orderId && (
          <p style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-border)',
            borderRadius: '8px',
            padding: '0.4rem 1rem',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            Pedido <strong>#{orderId}</strong>
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/cliente" className="btn-primary" style={{
            display: 'block',
            padding: '0.9rem',
            borderRadius: '10px',
            textDecoration: 'none',
            textAlign: 'center',
          }}>
            Ver Meus Pedidos
          </Link>
          <Link to="/" style={{
            display: 'block',
            padding: '0.9rem',
            borderRadius: '10px',
            textDecoration: 'none',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            transition: 'background 0.2s',
          }}>
            Continuar Comprando
          </Link>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
          Você será redirecionado para seus pedidos em instantes...
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
