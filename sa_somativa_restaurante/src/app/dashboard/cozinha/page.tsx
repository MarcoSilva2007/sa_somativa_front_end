'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [userRole, setUserRole] = useState<'cozinha' | 'gerente' | null>(null);
  const router = useRouter();

  // Função para buscar pedidos
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 🔑 Só inclui o header se você MANTER autenticação no listar()
      // Se você REMOVER a autenticação do listar(), pode apagar o headers inteiro
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/pedido', { headers });
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      const data: Order[] = await res.json();
      const sorted = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setOrders(sorted);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      // Opcional: redirecionar se não autorizado
      // router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const papel = payload.papel as 'cozinha' | 'gerente' | 'garcom';
      if (papel !== 'cozinha' && papel !== 'gerente') {
        router.push('/dashboard');
        return;
      }
      setUserRole(papel);
    } catch (e) {
      localStorage.removeItem('token');
      router.push('/login');
    }

    // Carrega pedidos imediatamente
    fetchOrders();

    // Atualiza a cada 8 segundos
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [router]);

  const updateStatus = async (id: string, newStatus: 'Em Preparo' | 'Entregue') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/pedido/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!userRole) {
    return <div>Carregando...</div>;
  }

  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tela da Cozinha</h1>
        <button className={styles.logout} onClick={handleLogout}>Sair</button>
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

              <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
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