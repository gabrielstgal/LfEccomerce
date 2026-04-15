import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        // Mostramos apenas os primeiros 4 produtos como destaque
        setProducts(res.data.slice(0, 4));
      })
      .catch(err => console.error("Erro ao buscar produtos", err));
  }, []);

  return (
    <>
      {/* Banner Principal - Fundo Escuro mantido para destacar a foto */}
      <section className="hero" style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '2rem 5%',
        backgroundImage: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 100%), url(https://images.unsplash.com/photo-1516826957135-700ede19c6e4?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', lineHeight: '1', fontWeight: '700' }}>
            Estilo que marca <span style={{ color: 'var(--color-primary)' }}>presença.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#e0e0e0', marginBottom: '2.5rem' }}>
            A nova coleção chegou. Vista o melhor da moda masculina em Campina Grande com a exclusividade e a força que você merece.
          </p>
          <a href="/catalogo" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Ver Lançamentos</a>
        </div>
      </section>

      {/* Destaques */}
      <section style={{ padding: '5rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <p style={{ color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Destaques da Semana</p>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text)' }}>Peças Exclusivas</h2>
          </div>
          <a href="/catalogo" style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid currentColor', paddingBottom: '2px' }}>Ver tudo</a>
        </div>

        {products.length === 0 ? (
           <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Mural Vazio... Adicione produtos no Painel Admin!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
