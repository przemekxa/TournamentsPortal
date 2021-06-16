
const url = 'http://localhost:8000/'

export async function getTournaments(name, page, limit = 10) {

  let resp = await fetch(url + 'api/tournaments?' + new URLSearchParams({
    name: name,
    page: page,
    limit: limit
  }), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  if(resp.ok) {
    return await resp.json()
  }
  return {
    'current_page': 1,
    'data': [],
    'total': 0
  }
}