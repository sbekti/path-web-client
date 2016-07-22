import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import Cookies from 'js-cookie'
import request from 'superagent'

class ViewCount extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }

    this.handleViewClick = this.handleViewClick.bind(this)
    this.handleEmotionClick = this.handleEmotionClick.bind(this)
  }

  handleViewClick() {
    const newExpanded = !this.state.expanded

    this.setState({
      expanded: newExpanded
    })
  }

  handleEmotionClick(e) {
    const { moment, user, customGeo, realGeo } = this.props
    const emotionType = e.target.dataset.tag

    this.setState({
      expanded: false
    })

    let body = {
      moment_id: moment.get('id'),
      emotion_type: emotionType,
      token: user.get('oauth_token')
    }

    const spoofLocation = Cookies.get('spoof_location')

    if (spoofLocation === 'true') {
      body.lat = customGeo.get('lat')
      body.lng = customGeo.get('lng')
    } else {
      body.lat = realGeo.get('lat')
      body.lng = realGeo.get('lng')
    }

    request
      .post('/api/v1/emotion/add')
      .send(body)
      .end((err, res) => {
        this.props.onEmotionClick(moment.get('id'))
      })
  }

  render() {
    const { views, dark } = this.props
    const { expanded } = this.state

    let element = null

    if (expanded) {
      element = (
        <div className='emotion-actions'>
          <button className='btn btn-default emotion-button' data-tag='happy' onClick={this.handleEmotionClick}>🙂</button>
          <button className='btn btn-default emotion-button' data-tag='laugh' onClick={this.handleEmotionClick}>😂</button>
          <button className='btn btn-default emotion-button' data-tag='surprise' onClick={this.handleEmotionClick}>😮</button>
          <button className='btn btn-default emotion-button' data-tag='sad' onClick={this.handleEmotionClick}>😢</button>
          <button className='btn btn-default emotion-button' data-tag='love' onClick={this.handleEmotionClick}>❤️</button>
        </div>
      )
    }

    return (
      <div className='view-count'>
        <div className='emotion-actions-wrap'>
          {element}
          <button className='btn btn-default emotion-button' onClick={this.handleViewClick}>
            <span className='glyphicon glyphicon-heart'></span> {views}
          </button>
        </div>
      </div>
    )
  }

}

export default ViewCount
