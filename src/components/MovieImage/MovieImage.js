import React from 'react'
import { Space } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import './MovieImage.css'

import noImage from '../../assets/NoImage.png'

export default class MovieImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  isLoaded = () => {
    this.setState({
      loading: false,
    })
  }

  render() {
    const { posterPath } = this.props
    const { loading } = this.state

    const image = (
      <img
        style={{ display: !loading ? 'flex' : 'none' }}
        onLoad={this.isLoaded}
        className={`card__poster${posterPath ? ' card__poster--loaded' : ''}`}
        alt="Film poster"
        src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : noImage}
      />
    )

    const spinner = loading ? (
      <Space className="card__poster" style={{ display: loading ? 'flex' : 'none' }}>
        <div className="card__spin">
          <LoadingOutlined
            style={{
              fontSize: 82,
            }}
            spin
          />
        </div>
      </Space>
    ) : null

    return (
      <React.Fragment>
        {spinner}
        {image}
      </React.Fragment>
    )
  }
}

MovieImage.defaultProps = {
  posterPath: null,
}

MovieImage.propTypes = {
  posterPath: PropTypes.string,
}
