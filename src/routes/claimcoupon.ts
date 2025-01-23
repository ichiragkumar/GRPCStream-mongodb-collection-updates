import express, { Request, Response } from "express";
import Coupon from "../../models/coupon";
import BusinessDetails from "../../models/BusinessDetails"
import { couponEventEmitter } from "../eventService";
const router = express.Router();

router.post("/claim-coupon", async (req: any, res: any) => {
  const { businessId, couponCode } = req.body;

  try {

    const coupon = await Coupon.findOne({
      code: couponCode,
      businessId,
      status: "active",
      expiry: { $gt: new Date() }, 
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
    }


    const business = await BusinessDetails.findOne({ id: businessId, left: { $gt: 0 } });
    if (!business) {
      return res.status(400).json({ success: false, message: "No coupons left for this business" });
    }


    business.left -= 1;
    await business.save();


    couponEventEmitter.emit("couponUpdated", {
      type: "ALL_USERS",
      data: { businessId, couponCode, remaining: business.left },
    });

    return res.status(200).json({ success: true, message: "Coupon claimed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post("/buisness-details", async (req: any, res: any) => {
  const { businessId, name, numbers, left } = req.body;

  try {
    await BusinessDetails.create({
      id: businessId,
      name,
      numbers,
      left
    });
    return res.status(200).json({ success: true, message: "Business details created successfully" });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}); 


router.post("/coupon-details", async (req: any, res: any) => {
  const { couponCode, businessId } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const business = await BusinessDetails.findOne({ id: businessId });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon details fetched successfully",
      data: {
        couponCode: coupon.code,
        businessId: coupon.businessId,
        status: coupon.status,
        expiryDate: coupon.expiry.toISOString(),
        totalCoupons: business.numbers,
        remainingCoupons: business.left,
        businessName: business.name
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post("/create-coupon", async (req: any, res: any) => {
  const { businessId, couponCode, status, expiryDate } = req.body;

  try {
    const business = await BusinessDetails.findOne({ id: businessId });
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const coupon = await Coupon.create({
      code: couponCode,
      businessId,
      status,
      expiry: new Date(expiryDate),
    });

    return res.status(200).json({ success: true, message: "Coupon created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export default router;
