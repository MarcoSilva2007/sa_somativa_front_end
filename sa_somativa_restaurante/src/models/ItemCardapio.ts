import { Schema, model, models, Document } from 'mongoose';

export interface IItemCardapio extends Document {
  nome: string;
  preco: number;
  categoria: string;
}

const ItemCardapioSchema = new Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true, min: 0 },
  categoria: { type: String, required: true }
}, { timestamps: true });

const ItemCardapio = models.ItemCardapio || model<IItemCardapio>('ItemCardapio', ItemCardapioSchema);
export default ItemCardapio;