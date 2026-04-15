import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#050505', borderTop: '1px solid var(--color-border)', padding: '4rem 2rem 2rem 2rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '2px' }}>LF CLOTHING</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>A loja de roupas masculinas que dita a moda em Campina Grande com estilo, força e qualidade.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Atendimento</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}>Contato</li>
            <li style={{ marginBottom: '0.5rem' }}>Frete e Entregas</li>
            <li style={{ marginBottom: '0.5rem' }}>Trocas e Devoluções</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Institucional</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}>Sobre a LF</li>
            <li style={{ marginBottom: '0.5rem' }}>Lojas Físicas</li>
            <li style={{ marginBottom: '0.5rem' }}>Termos de Uso</li>
          </ul>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '3rem auto 0 auto', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', borderTop: '1px solid #1a1a1a', paddingTop: '2rem' }}>
        &copy; {new Date().getFullYear()} LF Clothing. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;
