// import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";
// import path from "path";
// import { ProtoGrpcType } from "../generated/product";
// const productProtoPath = path.join(__dirname, "product.proto");
// const packageDefinition = protoLoader.loadSync(productProtoPath, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });



// const productPackage = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

// const client = new productPackage.product.Product("localhost:4002", grpc.credentials.createInsecure());

// // const call = client.streamProductEvents({});
// const call = client.streamCouponUpdates({ userId: "12345" });


// // const call = client.streamProductEvents({});

// call.on("data", (event) => {
//   console.log("Received event:", event);
// });
// call.on("end", () => {
//   console.log("Stream ended");
// });
// call.on("error", (error) => {
//   console.error("Error:", error);
// });
