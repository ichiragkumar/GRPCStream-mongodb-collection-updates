import mongoose, { Schema, Document } from "mongoose";

interface ICoupon extends Document {
  code: string; // Unique coupon code
  businessId: string; // Business ID associated with this coupon
  status: "active" | "inactive"; // Coupon status
  expiry: Date; // Expiration date of the coupon
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  businessId: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  expiry: { type: Date, required: true },
});

const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);
export default Coupon;
