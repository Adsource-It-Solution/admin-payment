import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  userId: string;
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
  createdAt: Date;
}

const CertificateSchema: Schema = new Schema({
  userId: { type: String},
  name: { type: String},
  title: { type: String},
  description: { type: String},
  leaderName: { type: String},
  advisorName: { type: String },
  leaderTitle: { type: String},
  advisorTitle: { type: String},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);
