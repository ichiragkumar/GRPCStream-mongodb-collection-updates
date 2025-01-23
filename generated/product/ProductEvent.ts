// Original file: src/product.proto

import type { ProductItem as _product_ProductItem, ProductItem__Output as _product_ProductItem__Output } from '../product/ProductItem';

export interface ProductEvent {
  'eventType'?: (string);
  'product'?: (_product_ProductItem | null);
}

export interface ProductEvent__Output {
  'eventType': (string);
  'product': (_product_ProductItem__Output | null);
}
