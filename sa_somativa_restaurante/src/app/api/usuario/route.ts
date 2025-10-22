import { NextRequest } from 'next/server';
import { registrar } from '@/controllers/UsuarioController';
import connectDB from '@/services/mongodb';

export async function POST(req: NextRequest) {
  await connectDB();
  return registrar(req);
}