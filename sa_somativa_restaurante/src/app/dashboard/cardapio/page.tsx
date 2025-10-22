// src/app/dashboard/cardapio/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cardapio.module.css';

export default function CardapioPage() {
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchItens = async () => {
      try {
        const res = await fetch('/api/itemcardapio');
        const data = await res.json();
        setItens(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItens();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1>Gerenciar Cardápio</h1>
        <button onClick={handleLogout} style={{ color: 'red', cursor: 'pointer' }}>Sair</button>
      </div>

      {loading ? (
        <p>Carregando itens...</p>
      ) : (
        <div>
          <button onClick={() => router.push('/dashboard/cardapio/novo')}>+ Novo Item</button>
          <ul>
            {itens.map(item => (
              <li key={item._id}>
                {item.nome} - R$ {item.preco.toFixed(2)} ({item.categoria})
                <button onClick={() => router.push(`/dashboard/cardapio/editar/${item._id}`)}>Editar</button>
                <button onClick={async () => {
                  if (confirm('Tem certeza?')) {
                    await fetch(`/api/itemcardapio/${item._id}`, { method: 'DELETE' });
                    setItens(itens.filter(i => i._id !== item._id));
                  }
                }}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}