"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponEventEmitter = exports.productEventEmitter = void 0;
exports.watchChanges = watchChanges;
const product_1 = require("../models/product");
const transaction_1 = require("../models/transaction");
const PrimaryTransaction_1 = require("../models/PrimaryTransaction");
const master_1 = require("../models/master");
const events_1 = __importDefault(require("events"));
exports.productEventEmitter = new events_1.default();
exports.couponEventEmitter = new events_1.default();
async function handleQuantityUpdateById(productId) {
    try {
        console.log(`Handling quantity update for product with ID ${productId}...`);
        const product = await product_1.Product.findOneAndUpdate({ _id: productId, quantity: { $gt: 0 } }, { $inc: { quantity: -1 } }, { new: true, runValidators: true });
        if (!product) {
            console.log(`Product with ID ${productId} not found`);
            return;
        }
        return `Product with ID ${productId} has been updated and decreased by 1`;
    }
    catch (error) {
        console.error(`Failed to update product quantities for ID ${productId}:`, error);
    }
}
function handleStreamErrors(changeStream, modelName) {
    changeStream.on("error", (error) => {
        console.error(`Error watching ${modelName} changes:`, error);
    });
}
function watchChanges() {
    const streams = [
        { stream: product_1.Product.watch([], { fullDocument: "updateLookup" }), name: "Product" },
        { stream: transaction_1.Transaction.watch([], { fullDocument: "updateLookup" }), name: "Transaction" },
        { stream: PrimaryTransaction_1.PrimaryTransaction.watch([], { fullDocument: "updateLookup" }), name: "PrimaryTransaction" },
        { stream: master_1.Master.watch([], { fullDocument: "updateLookup" }), name: "Master" },
    ];
    for (const { stream, name } of streams) {
        stream.on("change", async (change) => {
            if (change.operationType === "insert" && name === "Transaction") {
                console.log(`New transaction detected:`, change.fullDocument);
                // Get the productId from the transaction document
                const productId = change.fullDocument.productId;
                if (productId) {
                    await handleQuantityUpdateById(productId);
                }
                else {
                    console.error("ProductId not found in transaction document.");
                }
            }
            exports.productEventEmitter.emit("changeEvent", { name, change });
        });
        handleStreamErrors(stream, name);
    }
}
