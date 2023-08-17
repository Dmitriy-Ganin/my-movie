import { Alert } from 'antd'
import PropTypes from 'prop-types'

function ErrorSignal({ text }) {
  return <Alert message="Error" description={text} type="error" showIcon />
}

export default ErrorSignal

ErrorSignal.propTypes = {
  text: PropTypes.string.isRequired,
}
