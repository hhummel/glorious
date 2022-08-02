import { atom } from 'recoil';

import { Order  } from '../types';

export const cartState = atom<Array<Order>>({
    key: 'cartState',
    default: [],
  });
