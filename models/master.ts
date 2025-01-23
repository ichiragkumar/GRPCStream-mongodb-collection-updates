import mongoose, { Schema, Document } from "mongoose";

interface IMaster extends Document {
  code: string;
  name: string;
}

const MasterSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

export const Master = mongoose.model<IMaster>("Master", MasterSchema);
