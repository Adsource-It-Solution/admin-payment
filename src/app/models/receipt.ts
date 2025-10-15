import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReceipt extends Document {
  name: string;
  contact: string;
  address: string;
  itemDescription: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  paymentMethod: string;
  transactionID: string;
  date: string;
  createdAt: Date;
}

const ReceiptSchema: Schema<IReceipt> = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    itemDescription: { type: String },
    quantity: { type: String },
    unitPrice: { type: String },
    totalAmount: { type: String },
    paymentMethod: { type: String },
    transactionID: { type: String, unique: true }, // ✅ prevents duplicate receipts
    date: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Receipt: Model<IReceipt> =
  mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema);

export default Receipt;
