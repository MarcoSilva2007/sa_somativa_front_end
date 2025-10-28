'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../cardapio.module.css';

export default function NovoItemPage() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Você precisa estar logado!');
        router.push('/login');
        return;
      }

      const res = await fetch('/api/itemcardapio', {
        method: 'POST',
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
        alert('Item criado com sucesso!');
        router.push('/dashboard/cardapio');
      } else {
        const data = await res.json();
        if (res.status === 403) {
          alert('❌ Sem permissão! Apenas gerentes podem criar itens.');
        } else {
          alert(`Erro: ${data.error || 'Não foi possível criar o item'}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao criar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Novo Item do Cardápio</h1>
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
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}