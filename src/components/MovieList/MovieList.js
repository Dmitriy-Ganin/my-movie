import React from 'react'
import { Pagination, Space, Spin } from 'antd'
import PropTypes from 'prop-types'

import MovieCard from '../MovieCard'
import './MovieList.css'

export default class MovieList extends React.Component {
  renderList = () => {
    const { filmList, onChangeRate, ratedFilms } = this.props

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
          pageSize={10}
          showSizeChanger={false}
          total={totalResults > 10000 ? 10000 : totalResults}
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
