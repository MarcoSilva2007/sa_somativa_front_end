import { NextRequest, NextResponse } from 'next/server';
import Usuario from '../models/Usuario';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function registrar(req: NextRequest) {
  try {
    const { nome, email, senha, papel } = await req.json();
    const existente = await Usuario.findOne({ email });
    if (existente) return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });

    const usuario = new Usuario({ nome, email, senha, papel });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return NextResponse.json({ token, usuario: { nome, email, papel } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao registrar' }, { status: 500 });
  }
}

// src/controllers/UsuarioController.ts
export async function login(req: NextRequest) {
  try {
    const { email, senha } = await req.json();
    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // ✅ Inclui papel, nome e email no payload
    const token = jwt.sign(
      { id: usuario._id, papel: usuario.papel, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, usuario: { nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
  } catch (e) {
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 });
  }
}