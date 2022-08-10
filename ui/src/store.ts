import { UseInputRootSlotProps } from '@mui/base';
import { atom } from 'recoil';

import { Order, User, Product  } from '../types';

export const cartState = atom<Array<Order>>({
  key: 'cartState',
  default: [],
});

export const productState = atom<Array<Product>>({
  key: 'productState',
  default: [],
}); 

export const userState = atom<User | undefined>({
  key: 'userState',
  default: undefined,
});

export const visibleState = atom<number> ({
  key: 'visibleState',
  default: 1,
})
