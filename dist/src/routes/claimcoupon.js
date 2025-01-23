"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_1 = __importDefault(require("../../models/coupon"));
const BusinessDetails_1 = __importDefault(require("../../models/BusinessDetails"));
const eventService_1 = require("../eventService");
const router = express_1.default.Router();
router.post("/claim-coupon", async (req, res) => {
    const { businessId, couponCode } = req.body;
    try {
        const coupon = await coupon_1.default.findOne({
            code: couponCode,
            businessId,
            status: "active",
            expiry: { $gt: new Date() },
        });
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
        }
        const business = await BusinessDetails_1.default.findOne({ id: businessId, left: { $gt: 0 } });
        if (!business) {
            return res.status(400).json({ success: false, message: "No coupons left for this business" });
        }
        business.left -= 1;
        await business.save();
        eventService_1.couponEventEmitter.emit("couponUpdated", {
            type: "ALL_USERS",
            data: { businessId, couponCode, remaining: business.left },
        });
        return res.status(200).json({ success: true, message: "Coupon claimed successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.post("/buisness-details", async (req, res) => {
    const { businessId, name, numbers, left } = req.body;
    try {
        await BusinessDetails_1.default.create({
            id: businessId,
            name,
            numbers,
            left
        });
        return res.status(200).json({ success: true, message: "Business details created successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.post("/coupon-details", async (req, res) => {
    const { couponCode, businessId } = req.body;
    try {
        const coupon = await coupon_1.default.findOne({ code: couponCode });
        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }
        const business = await BusinessDetails_1.default.findOne({ id: businessId });
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
router.post("/create-coupon", async (req, res) => {
    const { businessId, couponCode, status, expiryDate } = req.body;
    try {
        const business = await BusinessDetails_1.default.findOne({ id: businessId });
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }
        const coupon = await coupon_1.default.create({
            code: couponCode,
            businessId,
            status,
            expiry: new Date(expiryDate),
        });
        return res.status(200).json({ success: true, message: "Coupon created successfully" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.default = router;
