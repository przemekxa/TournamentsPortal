import axios from 'axios'

const url = 'http://localhost:8000/'


export async function registerUser(data) {
  return await axios.post(url + 'api/users', data)
}

export async function login(data) {
  let response = await axios.post(url + 'api/login', data)
  return await response.data
}

export async function loginRestore(email) {
  let encoded = btoa(email)
  return await axios.post(url + `api/users/resetPassword/${encoded}`)
}

export async function logout() {
  try {
    await axios.post(url + 'api/logout')
  } catch(error) {
    console.log('Error logging out:', error)
  }
}

export async function me() {
  let resp = await axios.get(url + 'api/me')
  return resp.data
}

export async function activateAccount(data) {
  await axios.post(url + 'api/users/activate', data)
}

export async function resetPassword(email, password, restoration) {
  let data = {
    email: email,
    password: password,
    restoration: restoration
  };
  await axios.post(url + 'api/users/resetPassword', data);
}

