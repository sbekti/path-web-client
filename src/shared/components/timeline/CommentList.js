import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import MomentJS from 'moment'
import Cookies from 'js-cookie'
import request from 'superagent'

class CommentList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      processing: false
    }

    this.handleCommentChange = this.handleCommentChange.bind(this)
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this)
  }

  getLocation(locationId) {
    const { locations } = this.props
    let locationObject = locations.get(locationId)
    let location = null

    if (locationObject) {
      locationObject = locationObject.toJS()
      location = locationObject.location.city

      if (!location) location = locationObject.location.administrative_area_level_3
      if (!location) location = locationObject.location.administrative_area_level_2
      if (!location) location = locationObject.location.administrative_area_level_1
      if (!location) location = locationObject.location.province
      if (!location) location = locationObject.location.country
    }

    return location
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value })
  }

  handleCommentSubmit(e) {
    e.preventDefault()

    const { comment } = this.state
    const { moment, user, customGeo, realGeo } = this.props

    if (comment) {
      this.setState({ processing: true })

      let body = {
        moment_id: moment.get('id'),
        body: comment,
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
        .post('/api/v1/comments/add')
        .send(body)
        .end((err, res) => {
          this.setState({ processing: false })

          if (res && res.ok) {
            this.refs.comment.value = ''
            this.props.onCommentSubmitted(moment.get('id'))
          }
        })
    }
  }

  render() {
    const { comments, user, users, locations } = this.props

    const nodes = comments.map((comment) => {
      const user = users.get(comment.get('user_id'))
      const userName = `${user.get('first_name')} ${user.get('last_name')}`
      const userUrl = `/users/${user.get('id')}`
      const userAvatarUrl = user.get('photo') ? `${user.get('photo').get('url')}/${user.get('photo').get('ios').get('2x').get('file')}` : ''
      const commentBody = comment.get('body').replace(/(?:\r\n|\r|\n)/g, '<br />')
      const date = MomentJS(comment.get('created') * 1000).calendar()
      const timestamp = MomentJS(comment.get('created') * 1000).fromNow()
      const location = this.getLocation(comment.get('location_id'))
      const locationDisplay = location ? ` from ${location}` : ''

      return (
        <li className='list-group-item comment' key={comment.get('id')}>
          <div className='media-left'>
            <Link to={userUrl}>
              <img className='media-object avatar-small' alt={userName} src={userAvatarUrl} title={userName} />
            </Link>
          </div>
          <div className='media-body'>
            <p className='comment-body'>
              <strong><Link to={userUrl} title={userName}>{user.get('first_name')}</Link>:</strong>&nbsp;
              <span dangerouslySetInnerHTML={{__html: commentBody}}></span>
            </p>
            <p className='timestamp'><span title={date}>{timestamp}</span> {locationDisplay}</p>
          </div>
        </li>
      )
    })

    const userName = `${user.get('first_name')} ${user.get('last_name')}`
    const userUrl = `/users/${user.get('id')}`
    const userAvatarUrl = user.has('photo') ? `${user.get('photo').get('url')}/${user.get('photo').get('ios').get('2x').get('file')}` : ''

    const { processing } = this.state

    return (
      <ul className='list-group comment-list'>
        {nodes}
        <li className='list-group-item comment'>
          <div className='media-left'>
            <img className='media-object avatar-small' alt={userName} src={userAvatarUrl} title={userName} />
          </div>
          <div className='media-body'>
            <form role='form' onSubmit={this.handleCommentSubmit}>
              <input ref='comment' type='text' className='form-control input-comment' disabled={processing} onChange={this.handleCommentChange} placeholder='Write a comment...' />
              <button type='submit' className='hidden' disabled={processing} />
            </form>
          </div>
        </li>
      </ul>
    )
  }

}

export default CommentList
