// src/app/dashboard/pedido/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './pedido.module.css';

export default function PedidoPage() {
  const [mesa, setMesa] = useState<number>(1);
  const [itens, setItens] = useState<any[]>([]);
  const [cardapio, setCardapio] = useState<any[]>([]);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itemSelecionado, setItemSelecionado] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCardapio = async () => {
      const res = await fetch('/api/itemcardapio');
      const data = await res.json();
      setCardapio(data);
    };
    fetchCardapio();
  }, []);

  useEffect(() => {
    let total = 0;
    for (const item of itens) {
      const cardapioItem = cardapio.find(c => c._id === item.id);
      if (cardapioItem) {
        total += cardapioItem.preco * item.qtd;
      }
    }
    setTotal(total);
  }, [itens, cardapio]);

  const adicionarItem = () => {
    if (!itemSelecionado) return;
    setItens(prev => {
      const existe = prev.find(i => i.id === itemSelecionado);
      if (existe) {
        return prev.map(i => i.id === itemSelecionado ? { ...i, qtd: i.qtd + quantidade } : i);
      }
      return [...prev, { id: itemSelecionado, qtd: quantidade }];
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const itensFormatados = itens.map(item => {
      const cardapioItem = cardapio.find(c => c._id === item.id);
      return {
        itemCardapio: item.id,
        quantidade: item.qtd
      };
    });

    try {
      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ numeroMesa: mesa, itens: itensFormatados })
      });

      if (res.ok) {
        alert('Pedido enviado para a cozinha!');
        setItens([]);
        setMesa(1);
      } else {
        alert('Erro ao enviar pedido');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Criar Pedido</h1>
      <div>
        <label>Mesa: </label>
        <input type="number" value={mesa} onChange={e => setMesa(Number(e.target.value))} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <select value={itemSelecionado} onChange={e => setItemSelecionado(e.target.value)}>
          <option value="">Selecione um item</option>
          {cardapio.map(item => (
            <option key={item._id} value={item._id}>
              {item.nome} - R$ {item.preco.toFixed(2)}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={quantidade}
          onChange={e => setQuantidade(Number(e.target.value))}
          min="1"
          placeholder="Qtd"
        />
        <button onClick={adicionarItem}>Adicionar</button>
      </div>

      <ul>
        {itens.map((item, index) => {
          const cardapioItem = cardapio.find(c => c._id === item.id);
          return (
            <li key={index}>
              {cardapioItem?.nome} x{item.qtd}
            </li>
          );
        })}
      </ul>

      <p><strong>Total: R$ {total.toFixed(2)}</strong></p>

      <button onClick={handleSubmit}>Enviar para Cozinha</button>
    </div>
  );
}