import { NextRequest } from 'next/server';
import { atualizar, deletar } from '@/controllers/ItemCardapioController';
import connectDB from '@/services/mongodb';
import { comPermissao } from '@/lib/auth';

// PUT - Somente GERENTE pode editar itens
export const PUT = comPermissao(['gerente'], async (
  req: NextRequest,
  usuario,
  { params }: { params: { id: string } }
) => {
  await connectDB();
  return atualizar(req, params.id);
});

// DELETE - Somente GERENTE pode deletar itens
export const DELETE = comPermissao(['gerente'], async (
  req: NextRequest,
  usuario,
  { params }: { params: { id: string } }
) => {
  await connectDB();
  return deletar(params.id);
});