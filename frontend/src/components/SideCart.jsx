import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './SideCart.css';

const SideCart = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra!");
      setIsCartOpen(false);
      navigate('/auth');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className={`side-cart glass ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Seu carrinho está vazio.</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setIsCartOpen(false)}>Continuar Comprando</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.cartId} className="cart-item">
                <img src={item.image || item.imageUrl} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h4 className="item-name">{item.name} {item.selectedSize ? `(Tamanho: ${item.selectedSize})` : ''}</h4>
                  <p className="item-price">R$ {item.price.toFixed(2)}</p>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>Remover</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={handleProceedToCheckout}>
              Ir Para Pagamento
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;
