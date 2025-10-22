// src/app/cozinha/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './cozinha.module.css';

type OrderItem = {
  _id: string;
  quantidade: number;
  itemCardapio: {
    nome: string;
  };
};

type Order = {
  _id: string;
  numeroMesa: number;
  valorTotal: number;
  status: 'Recebido' | 'Em Preparo' | 'Entregue';
  itens: OrderItem[];
  createdAt: string;
};

export default function CozinhaPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'Recebido' | 'Em Preparo' | 'Entregue'>('Recebido');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pedido');
      const data = await res.json();
      // Ordena por createdAt (mais antigo primeiro)
      const sorted = data.sort((a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Atualiza a cada 10 segundos (opcional, mas útil na cozinha)
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: 'Em Preparo' | 'Entregue') => {
    try {
      await fetch(`/api/pedido/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders(); // atualiza a lista
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>👨‍🍳 Tela da Cozinha</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'Recebido' ? styles.active : ''}`}
          onClick={() => setActiveTab('Recebido')}
        >
          Recebidos ({orders.filter(o => o.status === 'Recebido').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Em Preparo' ? styles.active : ''}`}
          onClick={() => setActiveTab('Em Preparo')}
        >
          Em Preparo ({orders.filter(o => o.status === 'Em Preparo').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Entregue' ? styles.active : ''}`}
          onClick={() => setActiveTab('Entregue')}
        >
          Entregues ({orders.filter(o => o.status === 'Entregue').length})
        </button>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : filteredOrders.length === 0 ? (
        <p className={styles.empty}>Nenhum pedido com status "{activeTab}".</p>
      ) : (
        <div className={styles.orders}>
          {filteredOrders.map(order => (
            <div
              key={order._id}
              className={`${styles.orderCard} ${
                order.status === 'Em Preparo' ? styles.preparo :
                order.status === 'Entregue' ? styles.entregue : ''
              }`}
            >
              <div className={styles.header}>
                <span className={styles.table}>Mesa {order.numeroMesa}</span>
                <span className={styles.total}>R$ {order.valorTotal.toFixed(2)}</span>
              </div>

              <ul className={styles.items}>
                {order.itens.map(item => (
                  <li key={item._id}>
                    {item.quantidade}x {item.itemCardapio.nome}
                  </li>
                ))}
              </ul>

              <span className={`${styles.status} ${styles[order.status.toLowerCase() as keyof typeof styles]}`}>
                {order.status}
              </span>

              <div className={styles.actions}>
                {order.status === 'Recebido' && (
                  <button
                    className={styles.start}
                    onClick={() => updateStatus(order._id, 'Em Preparo')}
                  >
                    Iniciar Preparo
                  </button>
                )}
                {order.status === 'Em Preparo' && (
                  <button
                    className={styles.deliver}
                    onClick={() => updateStatus(order._id, 'Entregue')}
                  >
                    Marcar como Entregue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}