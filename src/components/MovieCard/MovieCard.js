import React from 'react'
import { Tag, Rate, Space, Spin, Typography } from 'antd'
import PropTypes from 'prop-types'

import СircleСolor from '../СircleСolor'
import ErrorSignal from '../ErrorSignal'
import MovieImage from '../MovieImage'
import GenresContext from '../GenresContext'
import './MovieCard.css'

const { Paragraph } = Typography

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: false,
    }
  }

  renderGenres = (genresArr, genres) => {
    console.log(genresArr, genres)
    if (genres && genresArr) {
      return genres.map((genreId) => {
        const genreObj = genresArr.find(({ id }) => id === genreId)

        return <Tag key={genreObj.id}>{genreObj.name}</Tag>
      })
    }
    return null
  }

  render() {
    const { loading, error } = this.state
    const { film, rating, onChangeRate } = this.props
    const {
      title,
      release_date: releaseDate,
      poster_path: posterPath,
      genre_ids: genres,
      vote_average: voteAverage,
      overview,
    } = film
    const hasData = !(loading || error)
    const errorMsg = error ? <ErrorSignal text="Film did not load" /> : null
    const spinner = loading ? (
      <Space size="middle">
        <Spin size="large" />
      </Space>
    ) : null
    const content = hasData ? (
      <React.Fragment>
        <MovieImage posterPath={posterPath} />
        <div className="card__header">
          <span className="card__title">
            <span className="card__title-text">{title}</span>
            <СircleСolor percent={voteAverage} />
          </span>
          <span className="card__date">{releaseDate}</span>
          <GenresContext.Consumer>
            {(genresArr) => <div className="card__genres">{this.renderGenres(genresArr, genres)}</div>}
          </GenresContext.Consumer>
        </div>
        <div className="card__description">
          <Paragraph ellipsis={{ rows: 4, expandable: false, symbol: '...' }}>{String(overview)}</Paragraph>
          <Rate className="card__rate" count={10} value={rating} onChange={onChangeRate} allowClear={false} />
        </div>
      </React.Fragment>
    ) : null

    return (
      <div className="card">
        {errorMsg}
        {spinner}
        {content}
      </div>
    )
  }
}

MovieCard.contextType = GenresContext

MovieCard.defaultProps = {
  rating: 0,
}

MovieCard.propTypes = {
  film: PropTypes.shape({
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    vote_average: PropTypes.number.isRequired,
    overview: PropTypes.string,
  }).isRequired,
  onChangeRate: PropTypes.func.isRequired,
  rating: PropTypes.number,
}
