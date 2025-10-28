import { NextRequest } from 'next/server';
import { listar, criar } from '@/controllers/PedidoController';
import connectDB from '@/services/mongodb';
import { comPermissao } from '@/lib/auth';

// GET - Somente COZINHA e GERENTE podem listar pedidos
export const GET = comPermissao(['cozinha', 'gerente'], async (req: NextRequest) => {
  await connectDB();
  return listar();
});

// POST - Somente GARÇOM pode criar pedidos
export const POST = comPermissao(['garcom'], async (req: NextRequest) => {
  await connectDB();
  return criar(req);
});