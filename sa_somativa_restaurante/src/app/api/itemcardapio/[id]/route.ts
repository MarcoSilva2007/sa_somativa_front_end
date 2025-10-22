import { NextRequest } from 'next/server';
import { atualizar, deletar } from '@/controllers/ItemCardapioController';
import connectDB from '@/services/mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  return atualizar(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  return deletar(params.id);
}