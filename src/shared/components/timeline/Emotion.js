import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import PathUtils from '../../lib/path-utils'

class Emotion extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { emotion, user } = this.props

    const userName = `${user.get('first_name')} ${user.get('last_name')}`
    const userAvatarUrl = user.has('photo') ? `${user.get('photo').get('url')}/${user.get('photo').get('ios').get('2x').get('file')}` : ''
    const linkToUser = `/users/${emotion.get('user_id')}`
    const emotionIcon = PathUtils.getEmoji(emotion.get('emotion_type'))

    return (
      <div className='emotion'>
        <Link to={linkToUser}>
          <img className='img media-object avatar-small' alt={userName} src={userAvatarUrl} title={userName} />
          <div className='emotion-icon'>{emotionIcon}</div>
        </Link>
      </div>
    )
  }

}

export default Emotion
