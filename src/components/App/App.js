import React from 'react'
import { Input, Tabs, Spin, Space, Modal } from 'antd'
import _debounce from 'lodash/debounce'
import { Offline, Online } from 'react-detect-offline'

import MovieService from '../../services'
import MovieList from '../MovieList'
import GenresContext from '../GenresContext/'
import ErrorSignal from '../ErrorSignal'
import './App.css'

export default class App extends React.Component {
  // задержка запроса на сервер
  movieService = new MovieService()
  searchFilmDebounce = _debounce(() => {
    const { searchFilm } = this.state
    this.setState({
      apiSearchFilm: searchFilm,
    })
  }, 1000)

  constructor(props) {
    super(props)
    this.state = {
      searchFilm: 'return',
      apiSearchFilm: 'return',
      filmList: [],
      currentPage: 1,
      totalResults: null,
      loading: false,
      error: null,
      currentTab: 'search',
      guestSessionId: null,
      genresList: null,
      ratedFilms: new Map(),
    }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    this.createGuestSession()
    this.getGenresList()
    this.getFilms()
    this.textInput.current.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTab, currentPage, apiSearchFilm } = this.state
    if (prevState.apiSearchFilm !== apiSearchFilm) {
      this.setState({
        currentPage: 1,
      })
      this.getFilms()
    }
    if (prevState.currentTab !== currentTab) {
      this.setState({
        currentPage: 1,
      })
      if (currentTab === 'search') {
        this.getFilms()
      } else {
        this.getRatedFilms()
      }
    }
    if (prevState.currentPage !== currentPage) {
      if (currentTab === 'search') {
        this.getFilms()
      } else {
        this.getRatedFilms()
        //здесь вкл rated
      }
    }
  }

  // поисковое слово
  onChangeSearch = (evt) => {
    this.setState({
      searchFilm: evt.target.value,
    })
    this.searchFilmDebounce()
  }

  onSubmitSearch = (evt) => {
    evt.preventDefault()
  }

  onChangePage = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  // вкладки
  onChangeTab = (tab) => {
    this.setState({
      currentTab: tab,
    })
  }

  // рейтинг кино...запрос на сервер и обратно
  onChangeRate = (rate, id) => {
    const { guestSessionId } = this.state
    this.movieService
      .rateMovie(guestSessionId, id, rate)
      .then(() => {
        this.setState(({ ratedFilms }) => ({
          ratedFilms: new Map(ratedFilms.set(id, rate)),
        }))
        localStorage.setItem(id, rate)
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  onError = (err) => {
    this.setState({
      error: err.message,
      loading: false,
    })
  }

  // фильмы
  getFilmsList(serviceFunc) {
    this.setState({
      loading: true,
    })
    try {
      serviceFunc().then((listFilm) => {
        this.setState({
          filmList: listFilm.results,
          totalResults: listFilm.total_results,
          loading: false,
        })
      })
    } catch (err) {
      this.onError(err)
    }
  }

  getFilms = () => {
    const { apiSearchFilm, currentPage } = this.state
    const { getSearch, getPopular } = this.movieService
    if (apiSearchFilm) {
      this.getFilmsList(() => getSearch(apiSearchFilm, currentPage))
    } else {
      this.getFilmsList(() => getPopular(currentPage))
    }
  }

  // оценёные фильмы
  getRatedFilms = () => {
    const { guestSessionId, currentPage } = this.state
    const { getRated } = this.movieService
    this.getFilmsList(() => getRated(guestSessionId, currentPage))
  }

  // создание сессии
  createGuestSession() {
    if (Date.parse(localStorage.getItem('expires_at')) < Date.now() || !localStorage.getItem('expires_at')) {
      try {
        this.movieService
          .createGuestSession()
          .then((result) => {
            this.setState({
              guestSessionId: result.guest_session_id,
            })
            localStorage.clear()
            localStorage.setItem('guest_session_id', result.guest_session_id)
            localStorage.setItem('expires_at', result.expires_at)
          })
          .catch((err) => {
            this.onError(err)
          })
      } catch (err) {
        this.onError(err)
      }
    } else {
      this.setState({
        guestSessionId: localStorage.getItem('guest_session_id'),
      })
    }
  }

  getGenresList() {
    this.movieService.getGenres().then(({ genres }) => {
      this.setState({
        genresList: genres,
      })
    })
  }

  networkError = (err) => {
    Modal.destroyAll()
    if (!err) {
      Modal.error({
        title: 'No internet connection',
        content: 'No internet connection',
      })
    } else {
      Modal.success({
        content: 'Successfull connection',
      })
    }
  }

  polling = {
    enabled: true,
    url: 'www.themoviedb.org/',
  }

  render() {
    const {
      filmList,
      guestSessionId,
      genresList,
      searchFilm,
      apiSearchFilm,
      totalResults,
      currentPage,
      ratedFilms,
      loading,
      error,
      currentTab,
      polling,
    } = this.state
    const hasData = !(loading || error)
    const errorSignal = error ? <ErrorSignal text={error} /> : null
    const spinner = loading ? (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    ) : null
    const content = hasData ? (
      <MovieList
        filmList={filmList}
        apiSearchFilm={apiSearchFilm}
        currentPage={currentPage}
        onChangePage={this.onChangePage}
        onChangeRate={this.onChangeRate}
        totalResults={totalResults}
        guestSessionId={guestSessionId}
        ratedFilms={ratedFilms}
        currentTab={currentTab}
      />
    ) : null

    const tabs = [
      {
        label: 'Search',
        key: 'search',
        children: (
          <div className="wrapper">
            <form onSubmit={this.onSubmitSearch}>
              <Input
                placeholder="Type to search"
                value={searchFilm}
                onChange={this.onChangeSearch}
                ref={this.textInput}
              />
            </form>
            {errorSignal}
            {spinner}
            {content}
          </div>
        ),
      },
      {
        label: 'Rated',
        key: 'rated',
        children: (
          <div className="wrapper">
            {errorSignal}
            {spinner}
            {content}
          </div>
        ),
      },
    ]

    return (
      <React.Fragment>
        <Online polling={polling}>
          <GenresContext.Provider value={genresList}>
            <div className="App">
              <Tabs items={tabs} centered onChange={this.onChangeTab} />
            </div>
          </GenresContext.Provider>
        </Online>
        <Offline polling={polling} onChange={this.networkError} />
      </React.Fragment>
    )
  }
}
