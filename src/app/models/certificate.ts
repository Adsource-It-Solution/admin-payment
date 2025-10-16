import { Schema, model, models, type Document, type Model } from "mongoose";

/* ----------------------------------------------
   🧩 Certificate Interface
---------------------------------------------- */
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

/* ----------------------------------------------
   🧩 Certificate Schema
---------------------------------------------- */
const certificateSchema = new Schema<ICertificate>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    leaderName: { type: String, required: true },
    advisorName: { type: String, required: true },
    leaderTitle: { type: String, required: true },
    advisorTitle: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

/* ----------------------------------------------
   🧠 Safe model export (avoids OverwriteModelError)
---------------------------------------------- */
const Certificate: Model<ICertificate> =
  models.Certificate || model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
