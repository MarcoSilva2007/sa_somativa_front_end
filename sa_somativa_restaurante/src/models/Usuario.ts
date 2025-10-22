import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  papel: 'gerente' | 'garcom' | 'cozinha';
}

const UsuarioSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  papel: { type: String, enum: ['gerente', 'garcom', 'cozinha'], required: true }
}, { timestamps: true });

UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// ✅ VERIFICA SE O MODEL JÁ EXISTE
const Usuario = models.Usuario || model<IUsuario>('Usuario', UsuarioSchema);
export default Usuario;