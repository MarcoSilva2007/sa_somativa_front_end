import { NextRequest, NextResponse } from 'next/server';
import ItemCardapio from '../models/ItemCardapio';

export async function listar() {
  try {
    const itens = await ItemCardapio.find().sort({ createdAt: 1 });
    return NextResponse.json(itens);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar' }, { status: 500 });
  }
}

export async function criar(req: NextRequest) {
  try {
    const { nome, preco, categoria } = await req.json();
    const item = new ItemCardapio({ nome, preco, categoria });
    await item.save();
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
  }
}

export async function atualizar(req: NextRequest, id: string) {
  try {
    const { nome, preco, categoria } = await req.json();
    const item = await ItemCardapio.findByIdAndUpdate(id, { nome, preco, categoria }, { new: true });
    if (!item) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

export async function deletar(id: string) {
  try {
    const item = await ItemCardapio.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ message: 'Deletado' });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}