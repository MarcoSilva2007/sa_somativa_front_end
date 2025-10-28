import { NextRequest } from 'next/server';
import { listar, criar } from '@/controllers/ItemCardapioController';
import connectDB from '@/services/mongodb';
import { comPermissao } from '@/lib/auth';

// GET - GERENTE e GARÇOM podem listar itens (para criar pedidos)
export const GET = comPermissao(['gerente', 'garcom'], async (req: NextRequest) => {
  await connectDB();
  return listar();
});

// POST - Somente GERENTE pode criar itens
export const POST = comPermissao(['gerente'], async (req: NextRequest) => {
  await connectDB();
  return criar(req);
});