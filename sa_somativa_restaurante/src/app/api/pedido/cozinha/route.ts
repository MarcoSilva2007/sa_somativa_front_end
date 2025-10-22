import { NextRequest } from 'next/server';
import { listarCozinha } from '@/controllers/PedidoController';
import connectDB from '@/services/mongodb';

export async function GET() {
  await connectDB();
  return listarCozinha();
}