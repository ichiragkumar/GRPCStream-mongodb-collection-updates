// Original file: src/product.proto

import type { Category as _product_Category, Category__Output as _product_Category__Output } from '../product/Category';

export interface ProductItem {
  'id'?: (number);
  'name'?: (string);
  'description'?: (string);
  'price'?: (number | string);
  'category'?: (_product_Category);
  'quantity'?: (number);
}

export interface ProductItem__Output {
  'id': (number);
  'name': (string);
  'description': (string);
  'price': (number);
  'category': (_product_Category__Output);
  'quantity': (number);
}
