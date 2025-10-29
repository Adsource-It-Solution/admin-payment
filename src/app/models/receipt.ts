import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReceipt extends Document {
  receiptno: string;
  name: string;
  contact: string;
  mobile: string;
  address: string;
  itemDescription: string;
  totalAmount: string;
  pan: string;
  paymentMethod: string;
  transactionID: string;
  date: string;
  createdAt: Date;
}
const ReceiptSchema: Schema<IReceipt> = new Schema(
  {
    name: { type: String, required: true },
    receiptno: {type: String},
    contact: { type: String },
    mobile: {type: String},
    address: { type: String },
    itemDescription: { type: String },
    totalAmount: { type: String },
    pan: {type: String},
    paymentMethod: { type: String },
    transactionID: { type: String, unique: true },
    date: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Receipt: Model<IReceipt> =
  mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema);

export default Receipt;
