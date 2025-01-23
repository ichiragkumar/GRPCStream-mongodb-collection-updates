import { Product } from "../models/product";
import { Transaction } from "../models/transaction";
import { PrimaryTransaction } from "../models/PrimaryTransaction";
import { Master } from "../models/master";
import EventEmitter from "events";

export const productEventEmitter = new EventEmitter();
export const couponEventEmitter = new EventEmitter();
async function handleQuantityUpdateById(productId: string) {
    try {
      console.log(`Handling quantity update for product with ID ${productId}...`);
      const product = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } },
        { new: true, runValidators: true }
      );
      if(!product){
        console.log(`Product with ID ${productId} not found`);
        return;
      }

      return `Product with ID ${productId} has been updated and decreased by 1`;
    } catch (error) {
      console.error(`Failed to update product quantities for ID ${productId}:`, error);
    }
  }


function handleStreamErrors(changeStream: any, modelName: string) {
  changeStream.on("error", (error: any) => {
    console.error(`Error watching ${modelName} changes:`, error);
  });
}


  
export function watchChanges() {
    const streams = [
      { stream: Product.watch([], { fullDocument: "updateLookup" }), name: "Product" },
      { stream: Transaction.watch([], { fullDocument: "updateLookup" }), name: "Transaction" },
      { stream: PrimaryTransaction.watch([], { fullDocument: "updateLookup" }), name: "PrimaryTransaction" },
      { stream: Master.watch([], { fullDocument: "updateLookup" }), name: "Master" },
    ];
  
    for (const { stream, name } of streams) {
      stream.on("change", async (change) => {
        if (change.operationType === "insert" && name === "Transaction") {
          console.log(`New transaction detected:`, change.fullDocument);
  
          // Get the productId from the transaction document
          const productId = change.fullDocument.productId;
          
          if (productId) {
            await handleQuantityUpdateById(productId);
          } else {
            console.error("ProductId not found in transaction document.");
          }
        }
  
        productEventEmitter.emit("changeEvent", { name, change });
      });
  
      handleStreamErrors(stream, name);
    }
  }
  

