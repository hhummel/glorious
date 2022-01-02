import { useGridApiMethod } from '@mui/x-data-grid';
import axios from 'axios';

const LOGIN_ENDPOINT = '/bread/auth/login/';
const LOGOUT_ENDPOINT = '/bread/alogout/';

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

import { Order } from '../../types';


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
    const res = await client.post("http://localhost:8000/bread/auth/login/", { username, password });
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
  const res = await client.post("http://localhost:8000/bread/auth/logout/");
}

/**
 * API helper to return orders from a specified user
 * 
 * @param userId 
 * @returns {status:string, data: User || undefined}
 */

export async function userOrders(userId: string) {
  const {data} = await client.get(`http://localhost:8000/bread/order/?user=${userId}`);
  return data;
}
