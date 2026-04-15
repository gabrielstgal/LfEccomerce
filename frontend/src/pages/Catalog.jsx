import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const CATEGORIES = ['Camisas', 'Camisetas', 'Calças', 'Jaquetas'];

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Filtros e Ordenação
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState('id,desc'); // id,desc (lançamento), price,asc (menor preço), price,desc (maior preço)
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    let url = `/products/search?page=${page}&size=12&sort=${sort}`;
    
    if (selectedCategories.length > 0) {
      url += `&categories=${selectedCategories.join(',')}`;
    }

    api.get(url)
      .then(res => {
        setProducts(res.data.content || []); // Paginated response has 'content'
        setTotalElements(res.data.totalElements || 0);
      })
      .catch(err => {
        console.error(err);
        // Fallback incase they hit fallback non-paginated endpoint
        if(err.response?.status === 404) {
             api.get('/products').then(res => setProducts(res.data));
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCategories, sort, page]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
    setPage(0); // Reset page on filter change
  };

  const handleAllCategories = () => {
    setSelectedCategories([]);
    setPage(0);
  };

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
      {/* Sidebar Filters */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Filtros</h3>
        
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Categorias</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <label>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.length === 0} 
                  onChange={handleAllCategories}
                  style={{ marginRight: '8px' }}
                /> Todas
              </label>
            </li>
            {CATEGORIES.map(cat => (
              <li key={cat} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    style={{ marginRight: '8px' }}
                  /> {cat}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Grid de Produtos */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Catálogo ({totalElements})</h2>
          <select 
            value={sort} 
            onChange={e => { setSort(e.target.value); setPage(0); }}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          >
            <option value="id,desc">Lançamentos</option>
            <option value="price,asc">Menor Preço</option>
            <option value="price,desc">Maior Preço</option>
          </select>
        </div>

        {loading ? (
          <p>Carregando as peças...</p>
        ) : products.length === 0 ? (
          <p>Nenhum produto encontrado com os filtros atuais.</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                 className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: page === 0 ? 'var(--color-surface)' : 'var(--color-primary)' }}
              >
                Anterior
              </button>
              <button 
                 disabled={products.length < 12} // Simples disable if not full page
                 onClick={() => setPage(p => p + 1)}
                 className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: products.length < 12 ? 'var(--color-surface)' : 'var(--color-primary)' }}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Catalog;
