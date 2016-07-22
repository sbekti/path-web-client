import React from 'react'
import ReactDOM from 'react-dom'

class Alert extends React.Component {

  render() {
    let className = 'alert'

    switch (this.props.type) {
      case 'success':
        className += ' alert-success'
        break
      case 'info':
        className += ' alert-info'
        break
      case 'warning':
        className += ' alert-warning'
        break
      case 'danger':
        className += ' alert-danger'
        break
    }

    return (
      <div className={className} role='alert'>
        {this.props.text}
      </div>
    )
  }

}

export default Alert
