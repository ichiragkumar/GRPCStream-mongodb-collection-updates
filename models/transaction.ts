import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
    code: string;
    salary: number;
    workingDays: number;
    salaryDate: Date;
    productId: mongoose.Types.ObjectId; 

}

const TransactionSchema: Schema = new Schema({
    code : {type: String, required: true},
    salary : {type: Number, required: true},
    workingDays : {type: Number, required: true},
    salaryDate : {type: Date, required: true},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },


});

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);