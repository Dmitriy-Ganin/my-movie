import React from 'react'
import { Pagination, Space, Spin } from 'antd'
import PropTypes from 'prop-types'

import MovieCard from '../MovieCard'
import ErrorSignal from '../ErrorSignal'
import './MovieList.css'

export default class MovieList extends React.Component {
  renderList = () => {
    const { filmList, onChangeRate, ratedFilms, apiSearchFilm, currentTab } = this.props

    if (filmList.length === 0 && apiSearchFilm !== '' && currentTab == 'search') {
      return <ErrorSignal text="No movies found for your search" />
    }

    if (!filmList) {
      return (
        <Space className="film-list__spin" size="middle">
          <Spin className="film-list__spin" size="large" />
        </Space>
      )
    }

    return filmList.map((film) => (
      <MovieCard
        key={film.id}
        film={film}
        id={film.id}
        onChangeRate={(rate) => onChangeRate(rate, film.id)}
        rating={Number(ratedFilms.get(film.id)) || Number(localStorage.getItem(film.id)) || 0}
      />
    ))
  }

  render() {
    const { totalResults, onChangePage, currentPage } = this.props
    return (
      <React.Fragment>
        <ul className="movie-list">{this.renderList()}</ul>
        <Pagination
          className="pagination"
          current={currentPage}
          onChange={onChangePage}
          pageSize={20}
          showSizeChanger={false}
          total={totalResults}
        />
      </React.Fragment>
    )
  }
}

MovieList.defaultProps = {
  filmList: null,
  totalResults: 0,
}

MovieList.propTypes = {
  filmList: PropTypes.arrayOf(PropTypes.shape({})),
  totalResults: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  onChangeRate: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  ratedFilms: PropTypes.any.isRequired,
}
