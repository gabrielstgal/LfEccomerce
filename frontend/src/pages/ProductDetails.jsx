import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Erro ao carregar produto", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '4rem 5%', textAlign: 'center' }}>Carregando detalhes...</div>;
  if (!product) return <div style={{ padding: '4rem 5%', textAlign: 'center' }}>Produto não encontrado.</div>;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
      return;
    }
    
    // Create an item object with the selected size
    const itemToAdd = {
      ...product,
      selectedSize: selectedSize || null // If no sizes available, this is null
    };
    
    addToCart(itemToAdd);
    navigate('/catalogo');
  };

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
      {/* Product Image */}
      <div style={{ flex: '1 1 400px' }}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/600x800?text=LF+Clothing'} 
          alt={product.name} 
          style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <span style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: 'bold' }}>{product.category}</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: '300' }}>R$ {product.price.toFixed(2)}</p>
        </div>

        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          {product.description || 'Nenhuma descrição fornecida para este produto.'}
        </p>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Tamanho</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '50px', height: '50px', borderRadius: '4px', border: '1px solid',
                    borderColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: selectedSize === size ? 'var(--color-primary)' : 'transparent',
                    color: selectedSize === size ? 'white' : 'var(--color-text)',
                    cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: product.stockAmount > 0 ? '#4caf50' : 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
          {product.stockAmount > 0 ? `${product.stockAmount} em estoque` : 'Esgotado'}
        </p>

        <button 
          className="btn-primary" 
          onClick={handleAddToCart}
          disabled={product.stockAmount <= 0}
          style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', opacity: product.stockAmount <= 0 ? 0.5 : 1 }}
        >
          {product.stockAmount > 0 ? 'Adicionar ao Carrinho' : 'Sem Estoque'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
