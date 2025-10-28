'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../cardapio.module.css';

type ItemCardapio = {
  _id: string;
  nome: string;
  preco: number;
  categoria: string;
};

export default function EditarItemPage() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/itemcardapio/`);
        const data: ItemCardapio[] = await res.json();
        const item = data.find(i => i._id === id);
        
        if (item) {
          setNome(item.nome);
          setPreco(item.preco.toString());
          setCategoria(item.categoria);
        } else {
          alert('Item não encontrado');
          router.push('/dashboard/cardapio');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Você precisa estar logado!');  
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/itemcardapio/${ id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          categoria
        })
      });

      if (res.ok) {
        alert('Item atualizado com sucesso!');
        router.push('/dashboard/cardapio');
      } else {
        const data = await res.json();
        if (res.status === 403) {
          alert('❌ Sem permissão! Apenas gerentes podem editar itens.');
        } else {
          alert(`Erro: ${data.error || 'Não foi possível atualizar o item'}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando item...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Editar Item do Cardápio</h1>
        <button 
          className={styles.logout} 
          onClick={() => router.push('/dashboard/cardapio')}
        >
          Voltar
        </button>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome do Item *</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Ex: Hambúrguer Artesanal"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="preco">Preço (R$) *</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              placeholder="Ex: 25.90"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Entrada">Entrada</option>
              <option value="Prato Principal">Prato Principal</option>
              <option value="Acompanhamento">Acompanhamento</option>
              <option value="Sobremesa">Sobremesa</option>
              <option value="Bebida">Bebida</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => router.push('/dashboard/cardapio')}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}