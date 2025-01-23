"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../db/db");
const product_1 = require("../models/product");
const eventService_1 = require("./eventService");
const transaction_1 = require("../models/transaction");
const coupon_1 = __importDefault(require("../models/coupon"));
const BusinessDetails_1 = __importDefault(require("../models/BusinessDetails"));
const express_1 = __importDefault(require("express"));
const claimcoupon_1 = __importDefault(require("./routes/claimcoupon"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// 1. find and load the product file, then 
const productProtoPath = path_1.default.join(__dirname, "product.proto");
const packageDefinition = protoLoader.loadSync(productProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
// choose type from generated proto file , very first 
const productPackage = grpc.loadPackageDefinition(packageDefinition);
const products = [];
async function createProduct(call, callback) {
    try {
        console.log("createProduct called", call.request);
        const { name, description, price, category, quantity } = call.request;
        console.log("quanitiy is", quantity);
        const newProduct = await product_1.Product.create({ name, description, price, category, quantity });
        if (newProduct) {
            await transaction_1.Transaction.create({
                code: `TRANSACTION_${newProduct.id}`,
                salary: newProduct.price * 10,
                workingDays: 30,
                salaryDate: new Date(),
                productId: newProduct._id,
            });
        }
        console.log(`Transaction created for product: ${newProduct.name}`);
        // // Emit a 'create' event
        eventService_1.productEventEmitter.emit('productEvent', {
            eventType: "CREATED",
            product: newProduct.toObject(),
        });
        eventService_1.productEventEmitter.emit('productEvent', {
            eventType: 'UPDATE',
            product: newProduct.toObject(),
        });
        callback(null, newProduct.toObject());
    }
    catch (error) {
        callback({ code: grpc.status.INTERNAL });
    }
}
async function processCouponUpdate(change, call) {
    if (change.operationType === "update") {
        const updatedCoupon = await coupon_1.default.findById(change.documentKey._id);
        if (!updatedCoupon) {
            console.error("Could not find the updated coupon");
            return;
        }
        const business = await BusinessDetails_1.default.findOne({ id: updatedCoupon.businessId });
        if (!business) {
            console.error("Could not find business details");
            return;
        }
        const response = {
            type: "UPDATED",
            couponCode: updatedCoupon.code,
            businessId: updatedCoupon.businessId,
            status: updatedCoupon.status,
            expiryDate: updatedCoupon.expiry.toISOString(),
            totalCoupons: business.numbers,
            remainingCoupons: business.left,
            businessName: business.name,
            message: `Coupon updated for ${business.name}`,
        };
        call.write(response);
    }
}
async function streamAllCouponUpdates(call) {
    try {
        const changeStream = coupon_1.default.watch();
        changeStream.on("change", async (change) => {
            await processCouponUpdate(change, call);
        });
        call.on("cancelled", () => {
            console.log("Stream cancelled, closing change stream");
            changeStream.close();
        });
        call.on("error", (error) => {
            console.error("Stream error:", error.message);
            changeStream.close();
        });
    }
    catch (error) {
        console.error("Error in streamAllCouponUpdates:", error);
    }
}
async function streamCouponUpdates(call) {
    const { businessId, couponCode } = call.request;
    try {
        console.log("businessId", businessId);
        console.log("couponCode", couponCode);
        const matchFilter = {};
        if (businessId) {
            matchFilter["fullDocument.businessId"] = businessId;
        }
        if (couponCode) {
            matchFilter["fullDocument.code"] = couponCode;
        }
        console.log("matchFilter", matchFilter);
        const changeStream = coupon_1.default.watch([
            {
                $match: matchFilter,
            },
        ]);
        changeStream.on("change", async (change) => {
            if (change.operationType === "update") {
                const updatedCoupon = await coupon_1.default.findById(change.documentKey._id);
                if (!updatedCoupon) {
                    console.error("Could not find the updated coupon");
                    return;
                }
                const business = await BusinessDetails_1.default.findOne({ id: updatedCoupon.businessId });
                if (!business) {
                    console.error("Could not find business details");
                    return;
                }
                const response = {
                    type: "UPDATED",
                    couponCode: updatedCoupon.code,
                    businessId: updatedCoupon.businessId,
                    status: updatedCoupon.status,
                    expiryDate: updatedCoupon.expiry.toISOString(),
                    totalCoupons: business.numbers,
                    remainingCoupons: business.left,
                    businessName: business.name,
                    message: `Coupon updated for ${business.name}`,
                };
                call.write(response);
            }
        });
        // Handle client cancellation or errors
        call.on("cancelled", () => {
            console.log("Stream cancelled, closing change stream");
            changeStream.close();
        });
        call.on("error", (error) => {
            console.error("Stream error:", error.message);
            changeStream.close();
        });
    }
    catch (error) {
        console.error("Error in streamCouponUpdates:", error);
    }
}
function streamProductEvents(call) {
    const listener = (event) => {
        console.log("u wast emmting it");
        call.write(event);
    };
    eventService_1.productEventEmitter.on('productEvent', listener);
    call.on('cancelled', () => {
        eventService_1.productEventEmitter.removeListener('productEvent', listener);
    });
}
function readProduct(call, callback) {
    const product = products.find((p) => p.id === call.request.id);
    product ? callback(null, product) : callback({ code: grpc.status.NOT_FOUND, message: "Product not found" });
}
function readProducts(call, callback) {
    callback(null, { products });
}
function updateProduct(call, callback) {
    const index = products.findIndex((p) => p.id === call.request.id);
    if (index === -1) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Product not found" });
    }
    products[index] = { ...products[index], ...call.request };
    callback(null, products[index]);
}
function deleteProduct(call, callback) {
    const index = products.findIndex((p) => p.id === call.request.id);
    if (index === -1) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Product not found" });
    }
    products.splice(index, 1);
    callback(null, { deleted: true });
}
const server = new grpc.Server();
server.addService(productPackage.product.Product.service, {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
    streamProductEvents,
    streamCouponUpdates,
    streamAllCouponUpdates,
});
server.bindAsync("0.0.0.0:4002", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running on 0.0.0.0:4000");
    (0, db_1.connectDB)();
    server.start();
});
app.use("/api", claimcoupon_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:3000}`);
});
(0, eventService_1.watchChanges)();
