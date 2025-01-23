// Original file: src/product.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CouponUpdateRequest as _product_CouponUpdateRequest, CouponUpdateRequest__Output as _product_CouponUpdateRequest__Output } from '../product/CouponUpdateRequest';
import type { CouponUpdateResponse as _product_CouponUpdateResponse, CouponUpdateResponse__Output as _product_CouponUpdateResponse__Output } from '../product/CouponUpdateResponse';
import type { DeleteProductResponse as _product_DeleteProductResponse, DeleteProductResponse__Output as _product_DeleteProductResponse__Output } from '../product/DeleteProductResponse';
import type { ProductEvent as _product_ProductEvent, ProductEvent__Output as _product_ProductEvent__Output } from '../product/ProductEvent';
import type { ProductId as _product_ProductId, ProductId__Output as _product_ProductId__Output } from '../product/ProductId';
import type { ProductItem as _product_ProductItem, ProductItem__Output as _product_ProductItem__Output } from '../product/ProductItem';
import type { ProductItems as _product_ProductItems, ProductItems__Output as _product_ProductItems__Output } from '../product/ProductItems';
import type { VoidParam as _product_VoidParam, VoidParam__Output as _product_VoidParam__Output } from '../product/VoidParam';

export interface ProductClient extends grpc.Client {
  CreateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  CreateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  CreateProduct(argument: _product_ProductItem, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  CreateProduct(argument: _product_ProductItem, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  createProduct(argument: _product_ProductItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  createProduct(argument: _product_ProductItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  createProduct(argument: _product_ProductItem, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  createProduct(argument: _product_ProductItem, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  
  DeleteProduct(argument: _product_ProductId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  DeleteProduct(argument: _product_ProductId, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  DeleteProduct(argument: _product_ProductId, options: grpc.CallOptions, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  DeleteProduct(argument: _product_ProductId, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  deleteProduct(argument: _product_ProductId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  deleteProduct(argument: _product_ProductId, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  deleteProduct(argument: _product_ProductId, options: grpc.CallOptions, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  deleteProduct(argument: _product_ProductId, callback: grpc.requestCallback<_product_DeleteProductResponse__Output>): grpc.ClientUnaryCall;
  
  ReadProduct(argument: _product_ProductId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  ReadProduct(argument: _product_ProductId, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  ReadProduct(argument: _product_ProductId, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  ReadProduct(argument: _product_ProductId, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  readProduct(argument: _product_ProductId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  readProduct(argument: _product_ProductId, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  readProduct(argument: _product_ProductId, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  readProduct(argument: _product_ProductId, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  
  ReadProducts(argument: _product_VoidParam, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  ReadProducts(argument: _product_VoidParam, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  ReadProducts(argument: _product_VoidParam, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  ReadProducts(argument: _product_VoidParam, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  readProducts(argument: _product_VoidParam, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  readProducts(argument: _product_VoidParam, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  readProducts(argument: _product_VoidParam, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  readProducts(argument: _product_VoidParam, callback: grpc.requestCallback<_product_ProductItems__Output>): grpc.ClientUnaryCall;
  
  StreamCouponUpdates(argument: _product_CouponUpdateRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_CouponUpdateResponse__Output>;
  StreamCouponUpdates(argument: _product_CouponUpdateRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_CouponUpdateResponse__Output>;
  streamCouponUpdates(argument: _product_CouponUpdateRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_CouponUpdateResponse__Output>;
  streamCouponUpdates(argument: _product_CouponUpdateRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_CouponUpdateResponse__Output>;
  
  UpdateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _product_ProductItem, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _product_ProductItem, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _product_ProductItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _product_ProductItem, options: grpc.CallOptions, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _product_ProductItem, callback: grpc.requestCallback<_product_ProductItem__Output>): grpc.ClientUnaryCall;
  
  streamProductEvents(argument: _product_ProductItem, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_ProductEvent__Output>;
  streamProductEvents(argument: _product_ProductItem, options?: grpc.CallOptions): grpc.ClientReadableStream<_product_ProductEvent__Output>;
  
}

export interface ProductHandlers extends grpc.UntypedServiceImplementation {
  CreateProduct: grpc.handleUnaryCall<_product_ProductItem__Output, _product_ProductItem>;
  
  DeleteProduct: grpc.handleUnaryCall<_product_ProductId__Output, _product_DeleteProductResponse>;
  
  ReadProduct: grpc.handleUnaryCall<_product_ProductId__Output, _product_ProductItem>;
  
  ReadProducts: grpc.handleUnaryCall<_product_VoidParam__Output, _product_ProductItems>;
  
  StreamCouponUpdates: grpc.handleServerStreamingCall<_product_CouponUpdateRequest__Output, _product_CouponUpdateResponse>;
  
  UpdateProduct: grpc.handleUnaryCall<_product_ProductItem__Output, _product_ProductItem>;
  
  streamProductEvents: grpc.handleServerStreamingCall<_product_ProductItem__Output, _product_ProductEvent>;
  
}

export interface ProductDefinition extends grpc.ServiceDefinition {
  CreateProduct: MethodDefinition<_product_ProductItem, _product_ProductItem, _product_ProductItem__Output, _product_ProductItem__Output>
  DeleteProduct: MethodDefinition<_product_ProductId, _product_DeleteProductResponse, _product_ProductId__Output, _product_DeleteProductResponse__Output>
  ReadProduct: MethodDefinition<_product_ProductId, _product_ProductItem, _product_ProductId__Output, _product_ProductItem__Output>
  ReadProducts: MethodDefinition<_product_VoidParam, _product_ProductItems, _product_VoidParam__Output, _product_ProductItems__Output>
  StreamCouponUpdates: MethodDefinition<_product_CouponUpdateRequest, _product_CouponUpdateResponse, _product_CouponUpdateRequest__Output, _product_CouponUpdateResponse__Output>
  UpdateProduct: MethodDefinition<_product_ProductItem, _product_ProductItem, _product_ProductItem__Output, _product_ProductItem__Output>
  streamProductEvents: MethodDefinition<_product_ProductItem, _product_ProductEvent, _product_ProductItem__Output, _product_ProductEvent__Output>
}
