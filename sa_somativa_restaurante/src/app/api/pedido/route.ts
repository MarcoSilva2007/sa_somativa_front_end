import { NextRequest } from 'next/server';
import { listar, criar } from '@/controllers/ItemCardapioController';
import connectDB from '@/services/mongodb';

export async function GET() {
  await connectDB();
  return listar();
}

export async function POST(req: NextRequest) {
  await connectDB();
  return criar(req);
}