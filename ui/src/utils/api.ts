import axios from 'axios';

const LOGIN_ENDPOINT = '/bread/auth/login/';
const LOGOUT_ENDPOINT = '/bread/alogout/';

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
 *  @return {string}
 */
export async function authenticate(username: String, password: String) {
  try {
    const res = await client.post("http://localhost:8000/bread/auth/login/", { username, password });
    
    console.log(`Result: ${res.status}`);
    if (res.data) {
        console.log(res.data);
    }
    return res.data.key;
  } catch (e) {
      if(axios.isAxiosError(e)){
        return e.response;
      }
    console.log("Login error of unknown type: ${e}"); 
  }
}

