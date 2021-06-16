import axios from 'axios'

const url = 'http://localhost:8000/'

export async function addRegistration(data) {
  return await axios.post(url + 'api/registrations', data)
}