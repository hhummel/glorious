import { UseInputRootSlotProps } from '@mui/base';
import { atom } from 'recoil';

import { Order, User  } from '../types';

export const cartState = atom<Array<Order>>({
    key: 'cartState',
    default: [],
  });

export const userState = atom<User | undefined>({
  key: 'userState',
  default: undefined,
});
