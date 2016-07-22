import React from 'react'
import ReactDOM from 'react-dom'
import MomentJS from 'moment'
import { Link } from 'react-router'
import VisibilitySensor from 'react-visibility-sensor'
import PhotoMoment from './PhotoMoment'
import VideoMoment from './VideoMoment'
import EmotionList from './EmotionList'
import CommentList from './CommentList'
import ViewCount from './ViewCount'

class Moment extends React.Component {

  constructor(props) {
    super(props)

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.handleCommentSubmitted = this.handleCommentSubmitted.bind(this)
    this.handleEmotionClick = this.handleEmotionClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.moment !== this.props.moment
  }

  getHeadline() {
    const moment = this.props.moment.toJS()
    let headline = moment.headline

    if (headline) {
      headline = headline.replace(/(?:\r\n|\r|\n)/g, '<br />')
    } else {
      headline = ''
    }

    return headline
  }

  getLocation() {
    const moment = this.props.moment.toJS()
    let location = null

    if (moment.location) {
      location = moment.location.city

      if (!location) location = moment.location.administrative_area_level_3
      if (!location) location = moment.location.administrative_area_level_2
      if (!location) location = moment.location.administrative_area_level_1
      if (!location) location = moment.location.province
      if (!location) location = moment.location.country
    }

    return location
  }

  handleVisibilityChange(isVisible, visibilityRect) {
    const { moment } = this.props
    const momentId = moment.get('id')

    this.props.onVisibilityChange(momentId, isVisible)
  }

  handleCommentSubmitted(momentId) {
    this.props.onCommentSubmitted(momentId)
  }

  handleEmotionClick(momentId) {
    this.props.onEmotionClick(momentId)
  }

  render() {
    const { moment, author, users, locations, user, customGeo, realGeo } = this.props

    const authorName = `${author.get('first_name')} ${author.get('last_name')}`
    const authorUrl = `/users/${author.get('id')}`
    const authorAvatarUrl = author.has('photo') ? `${author.get('photo').get('url')}/${author.get('photo').get('ios').get('2x').get('file')}` : ''
    const headline = this.getHeadline()
    const date = MomentJS(moment.get('created') * 1000).calendar()
    const timestamp = MomentJS(moment.get('created') * 1000).fromNow()
    const location = this.getLocation()
    const locationDisplay = location ? ` from ${location}` : ''
    const views = moment.get('seen_its').get('total')

    let media = null

    switch (moment.get('type')) {
      case 'photo':
        media = <PhotoMoment moment={moment} />
        break
      case 'video':
        media = <VideoMoment moment={moment} />
        break
    }

    return (
      <VisibilitySensor onChange={this.handleVisibilityChange} partialVisibility={true} delayedCall={true}>
        <li className='media moment'>
          <div className='media-left moment-left'>
            <Link to={authorUrl}>
              <img className='media-object avatar' alt={authorName} src={authorAvatarUrl} title={authorName} />
            </Link>
          </div>
          <div className='media-body moment-body'>
            <ViewCount
              views={views}
              moment={moment}
              user={user}
              customGeo={customGeo}
              realGeo={realGeo}
              onEmotionClick={this.handleEmotionClick}
            />
            {media}
            <p className='headline'>
              <strong><Link to={authorUrl} title={authorName}>{author.get('first_name')}</Link>:</strong>&nbsp;
              <span dangerouslySetInnerHTML={{__html: headline}}></span>
            </p>
            <p className='timestamp'><span title={date}>{timestamp}</span> {locationDisplay}</p>
            <EmotionList moment={moment} users={users} />
            <div className='clearfix'></div>
            <CommentList
              moment={moment}
              comments={moment.get('comments')}
              user={user}
              users={users}
              locations={locations}
              customGeo={customGeo}
              realGeo={realGeo}
              onCommentSubmitted={this.handleCommentSubmitted}
            />
          </div>
        </li>
      </VisibilitySensor>
    )
  }

}

export default Moment
