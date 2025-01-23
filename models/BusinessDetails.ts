import mongoose, { Schema, Document } from "mongoose";

interface IBusinessDetails extends Document {
    id: string; // Unique ID for the business
    name: string; // Name of the business
    numbers: number; // Total number of coupons available
    left: number; // Remaining coupons
  }
  
  const BusinessDetailsSchema = new Schema<IBusinessDetails>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    numbers: { type: Number, required: true, min: 0 },
    left: { type: Number, required: true, min: 0 },
  });
  
  const BusinessDetails = mongoose.model<IBusinessDetails>("BusinessDetails", BusinessDetailsSchema);
export default BusinessDetails;
  