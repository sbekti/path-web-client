import React from 'react'

class LoadMoreButton extends React.Component {

  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()

    this.props.onClick()
  }

  render() {
    let caption = 'Load More'
    let className = 'btn btn-default load-more'

    if (this.props.isLoading) {
      caption = 'Loading...'
      className += ' disabled'
    }

    return (
      <a className={className} onClick={this.handleClick}>{caption}</a>
    )
  }

}

export default LoadMoreButton
