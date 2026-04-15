import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Bem-vindo de volta!");
        navigate('/cliente');
      } else {
        await register(name, email, password, "ROLE_USER");
        toast.success("Conta criada! Você já pode fazer login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Falha na requisição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '3rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Nome Completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Aguarde...' : isLogin ? 'Fazer Login' : 'Cadastrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Não tem conta? " : "Já possui conta? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? "Cadastre-se" : "Faça Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
