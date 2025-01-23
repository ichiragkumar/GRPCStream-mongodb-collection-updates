// Original file: src/product.proto

export const Category = {
  SMARTPHONE: 'SMARTPHONE',
  CAMERA: 'CAMERA',
  LAPTOPS: 'LAPTOPS',
  HEADPHONES: 'HEADPHONES',
  CHARGERS: 'CHARGERS',
  SPEAKERS: 'SPEAKERS',
  TELEVISIONS: 'TELEVISIONS',
  MODEMS: 'MODEMS',
  KEYBOARDs: 'KEYBOARDs',
  MICROPHONES: 'MICROPHONES',
} as const;

export type Category =
  | 'SMARTPHONE'
  | 0
  | 'CAMERA'
  | 1
  | 'LAPTOPS'
  | 2
  | 'HEADPHONES'
  | 3
  | 'CHARGERS'
  | 4
  | 'SPEAKERS'
  | 5
  | 'TELEVISIONS'
  | 6
  | 'MODEMS'
  | 7
  | 'KEYBOARDs'
  | 8
  | 'MICROPHONES'
  | 9

export type Category__Output = typeof Category[keyof typeof Category]
