export type User = {
  id: string,
  username: string,
  first_name: string,
  last_name: string,
  email:string, 
  is_superuser: boolean,
  is_staff: boolean,
  is_active: boolean,
}

export type Order = {
  confirmed: boolean,
  delivered: boolean,
  delivery_date: string,
  index_key: number,
  meister: boolean,
  number: number,
  order_date: string,
  product: number,
  recipient_address: string | undefined,
  recipient_city: string | undefined,
  recipient_message: string | undefined,
  recipient_name: string | undefined,
  recipient_state: string | undefined,
  special_instructions: string | undefined,
  standing: boolean,
  this_is_a_gift: boolean,
  user: number,
}

export type Product = {
  id: number,
  category: number,
  product: string,
  label: string,
  price: number,
  picture: string,
}