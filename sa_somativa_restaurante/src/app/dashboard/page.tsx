// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  nome: string;
  email: string;
  papel: 'gerente' | 'garcom' | 'cozinha';
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        nome: payload.nome || 'Usuário',
        email: payload.email || '',
        papel: payload.papel || 'garcom'
      });
    } catch (e) {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Redireciona automaticamente com base no papel
      switch (user.papel) {
        case 'gerente':
          router.push('/dashboard/cardapio');
          break;
        case 'garcom':
          router.push('/dashboard/pedido');
          break;
        case 'cozinha':
          router.push('/dashboard/cozinha');
          break;
        default:
          router.push('/login');
      }
    }
  }, [user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return null; // Não renderiza nada, pois redireciona
}