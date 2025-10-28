// src/app/api/pedido/[id]/route.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/services/mongodb';
import { atualizarStatus as atualizarStatusController } from '@/controllers/PedidoController';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const papel = decoded.papel;

    if (papel !== 'cozinha' && papel !== 'gerente') {
      return new Response(JSON.stringify({ error: 'Permissão insuficiente' }), { status: 403 });
    }

    return atualizarStatusController(req, context.params.id);
  } catch (error: any) {
    console.error('Erro na rota PUT /pedido/[id]:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}