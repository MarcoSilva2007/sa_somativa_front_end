// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      setErro(data.error || 'Erro');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        {erro && <p className={styles.error}>{erro}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.btnSubmit}>Entrar</button>
        </form>
      </div>
    </div>
  );
}