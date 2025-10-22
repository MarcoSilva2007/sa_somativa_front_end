import { NextRequest, NextResponse } from 'next/server';
import Pedido from '../models/Pedido';
import ItemCardapio from '../models/ItemCardapio';
import jwt from 'jsonwebtoken';

export async function listar() {
  try {
    const pedidos = await Pedido.find()
      .populate('criadoPor', 'nome')
      .populate('itens.itemCardapio', 'nome preco');
    return NextResponse.json(pedidos);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar pedidos' }, { status: 500 });
  }
}

export async function criar(req: NextRequest) {
  try {
    const { numeroMesa, itens } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const usuarioId = decoded.id;

    let valorTotal = 0;
    for (const item of itens) {
      const cardapioItem = await ItemCardapio.findById(item.itemCardapio);
      if (!cardapioItem) throw new Error('Item não encontrado');
      valorTotal += cardapioItem.preco * item.quantidade;
    }

    const pedido = new Pedido({ numeroMesa, itens, valorTotal, criadoPor: usuarioId });
    await pedido.save();
    return NextResponse.json(pedido, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erro ao criar pedido' }, { status: 500 });
  }
}

export async function atualizarStatus(req: NextRequest, id: string) {
  try {
    const { status } = await req.json();
    const pedido = await Pedido.findByIdAndUpdate(id, { status }, { new: true })
      .populate('criadoPor', 'nome')
      .populate('itens.itemCardapio', 'nome preco');
    if (!pedido) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    return NextResponse.json(pedido);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 });
  }
}

export async function listarCozinha() {
  try {
    const pedidos = await Pedido.find({ status: 'Recebido' })
      .populate('criadoPor', 'nome')
      .populate('itens.itemCardapio', 'nome preco')
      .sort({ createdAt: 1 });
    return NextResponse.json(pedidos);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar cozinha' }, { status: 500 });
  }
}