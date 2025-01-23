import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "../generated/product";
import { connectDB } from "../db/db";
import { Product } from "../models/product";
import { EventEmitter } from 'events';
import { ProductEvent } from "../generated/product/ProductEvent";
import { couponEventEmitter, productEventEmitter, watchChanges } from "./eventService";
import { ProductItem } from "../generated/product/ProductItem";
import { Transaction } from "../models/transaction";
import {  CouponUpdateResponse } from "../generated/product/CouponUpdateResponse"
import { CouponUpdateRequest } from "../generated/product/CouponUpdateRequest"
import Coupon from "../models/coupon";
import BusinessDetails from "../models/BusinessDetails";
import express from "express";
import router from "./routes/claimcoupon";



const app = express();
app.use(express.json());



// 1. find and load the product file, then 
const productProtoPath = path.join(__dirname,  "product.proto");
const packageDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});



// choose type from generated proto file , very first 
const productPackage = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;




const products: ProductItem[] = [];





async function createProduct(
  call: grpc.ServerUnaryCall<ProductItem, ProductItem>,
  callback: grpc.sendUnaryData<ProductItem>
) {

  try {
    console.log("createProduct called", call.request);
    const { name, description, price, category, quantity } = call.request;

    console.log("quanitiy is", quantity);
    const newProduct = await Product.create({ name, description, price, category, quantity });


   if(newProduct){ 
      await Transaction.create({
      code: `TRANSACTION_${newProduct.id}`,
      salary: newProduct.price * 10,  
      workingDays: 30,       
      salaryDate: new Date(),
      productId: newProduct._id,
    }); 
   }

    console.log(`Transaction created for product: ${newProduct.name}`);
    // // Emit a 'create' event
    productEventEmitter.emit('productEvent', {
      eventType: "CREATED",
      product: newProduct.toObject() as ProductItem,
    });

    productEventEmitter.emit('productEvent', {
      eventType: 'UPDATE',
      product: newProduct.toObject() as ProductItem,
    });
    
    callback(null, newProduct.toObject() as ProductItem);
  } catch (error) {
    callback({ code: grpc.status.INTERNAL });
  }
}





async function processCouponUpdate(change: any, call: any) {
  if (change.operationType === "update") {
    const updatedCoupon = await Coupon.findById(change.documentKey._id);
    if (!updatedCoupon) {
      console.error("Could not find the updated coupon");
      return;
    }

    const business = await BusinessDetails.findOne({ id: updatedCoupon.businessId });
    if (!business) {
      console.error("Could not find business details");
      return;
    }

    const response: CouponUpdateResponse = {
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


async function streamAllCouponUpdates(
  call: grpc.ServerWritableStream<CouponUpdateRequest, CouponUpdateResponse>
) {
  try {
    const changeStream = Coupon.watch(); 

    changeStream.on("change", async (change: any) => {
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
  } catch (error) {
    console.error("Error in streamAllCouponUpdates:", error);
  }
}





async function streamCouponUpdates(
  call: grpc.ServerWritableStream<CouponUpdateRequest, CouponUpdateResponse>
) {
  const { businessId, couponCode } = call.request;

  try {

    console.log("businessId", businessId);
    console.log("couponCode", couponCode);
    const matchFilter: any = {};
    if (businessId) {
      matchFilter["fullDocument.businessId"] = businessId;
    }
    if (couponCode) {
      matchFilter["fullDocument.code"] = couponCode;
    }


    console.log("matchFilter", matchFilter);
    const changeStream = Coupon.watch([
      {
        $match: matchFilter,
      },
    ]);
    console.log("changeStream", changeStream);  


    changeStream.on("change", async (change: any) => {
      if (change.operationType === "update") {
        const updatedCoupon = await Coupon.findById(change.documentKey._id);
        if (!updatedCoupon) {
          console.error("Could not find the updated coupon");
          return;
        }

        const business = await BusinessDetails.findOne({ id: updatedCoupon.businessId });
        if (!business) {
          console.error("Could not find business details");
          return;
        }

        const response: CouponUpdateResponse = {
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
  } catch (error) {
    console.error("Error in streamCouponUpdates:", error);
  }
}






function streamProductEvents(call: grpc.ServerWritableStream<ProductItem, ProductEvent>) {
  const listener = (event: ProductEvent) => {
    console.log("u wast emmting it")
    call.write(event);
  };
  productEventEmitter.on('productEvent', listener);
  call.on('cancelled', () => {
    productEventEmitter.removeListener('productEvent', listener);
  });
}




function readProduct(call: grpc.ServerUnaryCall<{ id: number }, ProductItem>, callback: grpc.sendUnaryData<ProductItem>): void {
  const product = products.find((p) => p.id === call.request.id);
  product ? callback(null, product) : callback({ code: grpc.status.NOT_FOUND, message: "Product not found" });
}

function readProducts(call: grpc.ServerUnaryCall<unknown, { products: ProductItem[] }>, callback: grpc.sendUnaryData<{ products: ProductItem[] }>): void {
  callback(null, { products });
}

function updateProduct(call: grpc.ServerUnaryCall<ProductItem, ProductItem>, callback: grpc.sendUnaryData<ProductItem>): void {
  const index = products.findIndex((p) => p.id === call.request.id);
  if (index === -1) {
    return callback({ code: grpc.status.NOT_FOUND, message: "Product not found" });
  }
  products[index] = { ...products[index], ...call.request };
  callback(null, products[index]);
}

function deleteProduct(call: grpc.ServerUnaryCall<{ id: number }, { deleted: boolean }>, callback: grpc.sendUnaryData<{ deleted: boolean }>): void {
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
  connectDB();
  server.start();
});




app.use("/api",  router); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:3000}`);
});

watchChanges();
