export default class MovieService {
  _baseUrl = new URL('https://api.themoviedb.org/3/')

  _apiKey = '86d09f01f475fea7688e5264f0387a13'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmQwOWYwMWY0NzVmZWE3Njg4ZTUyNjRmMDM4N2ExMyIsInN1YiI6IjY0Y2ZjZjYwMzAzYzg1MDEzYTE1NjNkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TBfvN2ZIvGZ6zdc2QMRpevlkfELA3C0izYXOPL6kX74',
    },
  }

  async getResource(url) {
    const result = await fetch(url, this.options)
    if (!result.ok) {
      throw new Error(`Error ${url}, status: ${result.status}`)
    }
    const body = await result.json()
    return body
  }

  getPopular = async (page) => {
    const url = new URL('movie/popular?', this._baseUrl)
    url.searchParams.set('page', page)
    const result = await this.getResource(url, this.options)
    return result
  }

  getSearch = async (query, page) => {
    const url = new URL('search/movie?', this._baseUrl)
    url.searchParams.set('query', query)
    url.searchParams.set('page', page)
    const result = await this.getResource(url, this.options)
    return result
  }

  getGenres = async () => {
    const url = new URL('genre/movie/list', this._baseUrl)
    url.searchParams.set('api_key', this._apiKey)
    const result = await this.getResource(url, this.options)
    return result
  }

  createGuestSession = async () => {
    const url = new URL('authentication/guest_session/new?', this._baseUrl)
    url.searchParams.set('api_key', this._apiKey)
    const result = await this.getResource(url, this.options)
    return result
  }

  rateMovie = async (guestSessionId, filmId, rateValue) => {
    const rate = {
      value: rateValue,
    }
    const url = new URL(`movie/${filmId}/rating?`, this._baseUrl)
    url.searchParams.set('api_key', this._apiKey)
    url.searchParams.set('guest_session_id', guestSessionId)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(rate),
    })
    const result = await response.json()
    return result
  }

  getRated = async (guestSessionId, page) => {
    const url = new URL(`guest_session/${guestSessionId}/rated/movies?`, this._baseUrl)
    url.searchParams.set('api_key', this._apiKey)
    url.searchParams.set('page', page)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.status)
    }
    return await response.json()
  }
}
