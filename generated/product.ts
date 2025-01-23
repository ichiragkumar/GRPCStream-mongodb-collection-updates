import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ProductClient as _product_ProductClient, ProductDefinition as _product_ProductDefinition } from './product/Product';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  product: {
    Category: EnumTypeDefinition
    CouponUpdateRequest: MessageTypeDefinition
    CouponUpdateResponse: MessageTypeDefinition
    DeleteProductResponse: MessageTypeDefinition
    Product: SubtypeConstructor<typeof grpc.Client, _product_ProductClient> & { service: _product_ProductDefinition }
    ProductEvent: MessageTypeDefinition
    ProductId: MessageTypeDefinition
    ProductItem: MessageTypeDefinition
    ProductItems: MessageTypeDefinition
    VoidParam: MessageTypeDefinition
  }
}

