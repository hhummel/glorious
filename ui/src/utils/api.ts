import { useGridApiMethod } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { ExitStatus, NumberLiteralType } from 'typescript';

import { Order, Contact } from '../../types';
import { baseURL } from '../config';

const LOGIN_ENDPOINT = '/bread/auth/login/';
const LOGOUT_ENDPOINT = '/bread/logout/';

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


/**
 *  API helper to log in a user by username and password
 *
 *  @param {string} username - Username as entered
 *  @param {string} password - Password as entered
 *  @return {status:string, data: User || undefined}
 */
export async function authenticate(username: String, password: String) {
  try {
    const res = await client.post(`${baseURL}/bread/auth/login/`, { username, password });
    return ({"status": res.status, "data": res?.data});
  } catch (e) {
      if(axios.isAxiosError(e)){
        return ({"status": e.response, "data": undefined});
      }
    return ({"status": "500", "data": undefined});
  }
}

/**
 * API helper to log a user out
 */
export async function logout() {
  const res = await client.post(`${baseURL}/bread/auth/logout/`);
}

/**
 * API helper to return orders from a specified user
 * 
 * @param userId 
 * @returns Array<Order>
 */

export async function userOrders(userId: number) {
  const {data} = await client.get(`${baseURL}/bread/order/?user=${userId}`);
  return data;
}

/**
 * API helper to return a list of products
 * 
 * @returns Array<Products>
 */

 export async function products() {
  const {data} = await client.get(`${baseURL}/bread/products/`);
  return data;
}

/**
* API helper to return contact information for a specified user
* 
* @param userId 
* @returns Contact
*/

export async function getContact(userId: number): Promise<Contact> {
 const {data} = await client.get(`${baseURL}/bread/contacts/${userId}/`);
 return data;
}

/**
* API helper to update contact information for a specified user
* 
* @param userId
* @param contact
* @returns Promise<status, Contact>
*/

type ContactResponse = {
  status: number,
  data: Contact | undefined
}

export async function updateContact(userId: number, contact: Contact): Promise<ContactResponse> {
  try {
    const res = await client.patch(`${baseURL}/bread/contacts/${userId}/`, { ...contact});
    return ({"status": res.status, "data": res?.data});
  } catch (e) {
    return ({"status": 400, "data": undefined});
  }
}

type AddressResponse = {
  status: number,
  data: string | undefined
}

export async function getValidatedAddress(address: string, city: string, state: string): Promise<AddressResponse>  {
  try {
    const res = await client.post(`${baseURL}/bread/validate_address`, {address, city, state});
    return ({"status": res.status, "data": res?.data});
  } catch (e) {
    return ({"status": 500, "data": undefined});
  }
}
