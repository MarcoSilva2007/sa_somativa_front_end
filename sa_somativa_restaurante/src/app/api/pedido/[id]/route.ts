import { NextRequest } from 'next/server';
import { atualizarStatus } from '@/controllers/PedidoController';
import connectDB from '@/services/mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  return atualizarStatus(req, params.id);
}