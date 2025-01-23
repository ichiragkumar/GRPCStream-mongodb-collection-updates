import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
});






export const Product = mongoose.model<IProduct>("Product", ProductSchema);
