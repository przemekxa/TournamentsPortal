import axios from 'axios'

export const url = 'http://localhost:8000/'

export async function getTournaments(name, page, limit = 10) {

  try {
    let response = await axios.get(url + 'api/tournaments', {
      params: {
        name: name,
        page: page,
        limit: limit,
      }
    })
    return await response.data
  } catch {
    return {
      'current_page': 1,
      'data': [],
      'total': 0
    }
  }
  
}

export async function getTournament(id) {
  let response = await axios.get(url + `api/tournaments/${id}`)
  return await response.data
}

export async function addTournament(data) {
  let response = await axios.post(url + 'api/tournaments', data)
  return await response.data
}

export async function deleteTournament(id) {
  await axios.delete(url + `api/tournaments/${id}`)
}

export async function  addLogo(tournament, logo) {
  let formData = new FormData()
  formData.append('tournament', tournament)
  formData.append('logo', logo)

  await axios.post(url + 'api/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export async function  deleteLogo(logo) {
  await axios.delete(url + `api/logo/${logo}`)
}

export async function editTournament(id, data) {
  await axios.put(url + `api/tournaments/${id}`, data)
}

export async function getMatches(tournament) {
  let response = await axios.get(url + `api/matches/${tournament}`)
  return await response.data
}

export async function addWinner(tournament, match, winner) {
  let data = {
    id: match,
    winner: winner
  }
  await axios.post(url + `api/matches/${tournament}/winner`, data)
}