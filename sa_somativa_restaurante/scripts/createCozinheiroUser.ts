// scripts/createAdminUser.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega .env.local da RAIZ do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI não definido no .env.local');
}

// Conecta ao MongoDB
await mongoose.connect(MONGODB_URI);
console.log('✅ Conectado ao MongoDB');

// Define o schema (mesmo do seu model)
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  papel: { type: String, enum: ['gerente', 'garcom', 'cozinha'], required: true }
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

// Cria o cozinheiro
const senhaHash = await bcrypt.hash('123456', 12);
const adminData = {
  nome: 'Cozinheiro',
  email: 'cozinha@marco.com',
  senha: senhaHash,
  papel: 'cozinha'
};

try {
  await Usuario.create(adminData);
  console.log('✅ Usuário cozinheiro criado com sucesso!');
} catch (error: any) {
  if (error.code === 11000) {
    console.log('⚠️ Usuário cozinheiro já existe.');
  } else {
    console.error('❌ Erro ao criar cozinheiro:', error.message);
  }
}

await mongoose.connection.close();
console.log('🔌 Conexão fechada.');