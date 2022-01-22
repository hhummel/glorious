export type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email:string, 
  is_superuser: boolean,
  is_staff: boolean,
  is_active: boolean
}

export type Order = {
  confirmed: boolean,
  delivered: boolean,
  delivery_date: Date,
  index_key: number | undefined,
  meister: boolean,
  number: number,
  order_date: string,
  product: Product,
  recipient_address: string | undefined,
  recipient_city: string | undefined,
  recipient_message: string | undefined,
  recipient_name: string | undefined,
  recipient_state: string | undefined,
  special_instructions: string | undefined,
  standing: boolean,
  this_is_a_gift: boolean,
  user: number
}

export type Product = {
  id: number,
  category: number,
  product: string,
  label: string,
  price: number,
  picture: string
}

export type Contact = {
  creation: string,
  user_id: number,
  first_name: string,
  middle_name: string | undefined,
  last_name: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  municipality: string | undefined
  email: string,
  mobile: string,
  carrier: string | undefined,
  active: boolean
}

export type DateObj = {
  year: number;
  month: number;
  date: number;
}

export type DateConstraints = {
enabledDates: Array<DateObj>;
disabledDates: Array<DateObj>;
disabledDays: Array<number>;
disablePast: boolean;
}

export type Brand = {
  name: string,
  legalEntityName: string,
  legalEntityURL: string,
  theme: string,
}
