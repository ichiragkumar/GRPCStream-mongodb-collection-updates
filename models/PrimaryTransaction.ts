import mongoose, { Schema, Document } from "mongoose";

interface PITransaction extends Document {
  masterCode: string;
  salaryDate: Date;
  workingDays: number;
  salary: number;
}

const PTransactionSchema: Schema = new Schema({
  masterCode: { type: String, required: true, ref: "Master" },
  salaryDate: { type: Date, required: true },
  workingDays: { type: Number, required: true },
  salary: { type: Number, required: true },
});

export const PrimaryTransaction = mongoose.model<PITransaction>("PrimaryTransaction", PTransactionSchema);
