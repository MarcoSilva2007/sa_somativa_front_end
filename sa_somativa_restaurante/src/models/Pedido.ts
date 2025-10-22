import { Schema, model, models, Document } from 'mongoose';

export interface IPedido extends Document {
  numeroMesa: number;
  itens: { itemCardapio: any; quantidade: number }[];
  status: 'Recebido' | 'Em Preparo' | 'Entregue';
  valorTotal: number;
  criadoPor: any;
}

const PedidoSchema = new Schema({
  numeroMesa: { type: Number, required: true, min: 1 },
  itens: [{
    itemCardapio: { type: Schema.Types.ObjectId, ref: 'ItemCardapio', required: true },
    quantidade: { type: Number, required: true, min: 1 }
  }],
  status: {
    type: String,
    enum: ['Recebido', 'Em Preparo', 'Entregue'],
    default: 'Recebido'
  },
  valorTotal: { type: Number, required: true },
  criadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

const Pedido = models.Pedido || model<IPedido>('Pedido', PedidoSchema);
export default Pedido;