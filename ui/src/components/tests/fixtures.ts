import { Order, Product, User } from '../../../types';

export const product: Product = {
    id: 1,
    category: 1,
    product: "A product",
    label: "Label",
    price: 1,
    picture: "A picture",
  }

export const order: Order = {
    confirmed: true,
    delivered: true,
    delivery_date: new Date(),
    index_key: 1,
    meister: true,
    number: 1,
    order_date: "a date",
    product: product,
    recipient_address: undefined,
    recipient_city: undefined,
    recipient_message: undefined,
    recipient_name: undefined,
    recipient_state: undefined,
    recipient_zip: undefined,
    special_instructions: undefined,
    standing: false,
    this_is_a_gift: false,
    user: 1,
}

export const user: User = {
  id: 1,
  username: "A user",
  first_name: "First",
  last_name: "Last",
  email: "moe@stooges.com", 
  is_superuser: true,
  is_staff: false,
  is_active: true,
}