import mongoose, {Schema, Document}  from "mongoose";

export interface ICreateId extends Document{
    name?: string;
  role: string;
  idNumber: string;
  phone: string;
  email: string;
  DOB: string;
  address: string;
  createdat: Date;
}

const CreateIdSchema: Schema = new Schema ({
    name: {type: String},
    role: {type: String},
    idNumber: {type: String},
    phone: {type: String},
    email: {type: String},
    DOB: {type: String},
    address: {type: String},
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CreateId || mongoose.model<ICreateId>("CreateId", CreateIdSchema);