import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const { user, logout } = useAuth();

  return (
    <header className={`header ${isScrolled ? 'header-scrolled glass' : ''}`}>
      <div className="header-brand">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo">LF CLOTHING</h1>
        </Link>
      </div>
      
      <nav className="header-nav">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Início</Link>
        <Link to="/catalogo" className={`nav-link ${isActive('/catalogo')}`}>Catálogo</Link>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
        )}
      </nav>

      <div className="header-actions">
        <button className="action-btn" onClick={() => setIsCartOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <Link to={user ? "/cliente" : "/auth"} className="action-btn user-btn" title={user ? "Minha Conta" : "Login"}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Header;
