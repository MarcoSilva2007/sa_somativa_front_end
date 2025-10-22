// src/app/dashboard/cardapio/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cardapio.module.css';

type ItemCardapio = {
  _id: string;
  nome: string;
  preco: number;
  categoria: string;
};

export default function CardapioPage() {
  const [itens, setItens] = useState<ItemCardapio[]>([]);
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

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await fetch(`/api/itemcardapio/${id}`, { method: 'DELETE' });
        setItens(itens.filter(i => i._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Cardápio</h1>
        <button className={styles.logout} onClick={handleLogout}>Sair</button>
      </div>

      {loading ? (
        <p>Carregando itens...</p>
      ) : (
        <div className={styles.card}>
          <button className={styles.btn} onClick={() => router.push('/dashboard/cardapio/novo')}>
            + Novo Item
          </button>
          <ul className={styles.itemList}>
            {itens.map(item => (
              <li key={item._id}>
                <div className={styles.info}>
                  <div className={styles.name}>{item.nome}</div>
                  <div className={styles.category}>{item.categoria}</div>
                </div>
                <div className={styles.price}>R$ {item.preco.toFixed(2)}</div>
                <div className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => router.push(`/dashboard/cardapio/editar/${item._id}`)}
                  >
                    Editar
                  </button>
                  <button className={styles.delete} onClick={() => handleDelete(item._id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}