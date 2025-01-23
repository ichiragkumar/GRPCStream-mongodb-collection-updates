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
// Load the proto file
const productProtoPath = path_1.default.join(__dirname, "product.proto");
const packageDefinition = protoLoader.loadSync(productProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const productProto = grpc.loadPackageDefinition(packageDefinition);
const productPackage = productProto.product.Product;
const products = [];
function createProduct(call, callback) {
    const data = call.request;
    const newProduct = { ...data, id: products.length + 1 };
    products.push(newProduct);
    callback(null, newProduct);
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
const handlerForall = (call, callback) => {
    callback(null, { products });
};
const server = new grpc.Server();
server.addService(productPackage, {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
});
server.bindAsync("0.0.0.0:4002", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running on 0.0.0.0:4000");
    server.start();
});
