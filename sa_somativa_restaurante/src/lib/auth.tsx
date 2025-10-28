import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Tipos
type Papel = 'gerente' | 'garcom' | 'cozinha';

interface UsuarioToken {
  id: string;
  email: string;
  papel: Papel;
  iat: number;
  exp: number;
}

// Função para verificar e decodificar o token JWT
export function verificarToken(req: NextRequest): UsuarioToken | null {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UsuarioToken;
    
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

// Higher Order Function para proteger rotas com permissões
export function comPermissao(
  papeisPermitidos: Papel[],
  handler: (req: NextRequest, usuario: UsuarioToken, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // 1. Verificar se o usuário está autenticado
    const usuario = verificarToken(req);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Não autenticado. Token inválido ou ausente.' },
        { status: 401 }
      );
    }

    // 2. Verificar se o usuário tem permissão
    if (!papeisPermitidos.includes(usuario.papel)) {
      return NextResponse.json(
        { 
          error: 'Sem permissão para esta ação.',
          papelNecessario: papeisPermitidos,
          seuPapel: usuario.papel
        },
        { status: 403 }
      );
    }

    // 3. Se passou nas validações, executa o handler
    return handler(req, usuario, ...args);
  };
}

// Função para rotas que exigem apenas autenticação (qualquer papel)
export function autenticado(
  handler: (req: NextRequest, usuario: UsuarioToken, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const usuario = verificarToken(req);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Não autenticado. Token inválido ou ausente.' },
        { status: 401 }
      );
    }

    return handler(req, usuario, ...args);
  };
}