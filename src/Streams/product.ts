import * as grpc from "@grpc/grpc-js";
import { ProductEvent } from "../../generated/product/ProductEvent";
import { ProductItem } from "../../generated/product/ProductItem";
import { productEventEmitter } from "../eventService";

export const streamProductEvents = (call: grpc.ServerWritableStream<ProductItem, ProductEvent>) => {
  const listener = (event: ProductEvent) => {
    console.log("u wast emmting it")
    call.write(event);
  };
  productEventEmitter.on('productEvent', listener);
  call.on('cancelled', () => {
    productEventEmitter.removeListener('productEvent', listener);
  });
}
