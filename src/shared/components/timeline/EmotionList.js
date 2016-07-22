import React from 'react'
import ReactDOM from 'react-dom'
import Emotion from './Emotion'

class EmotionList extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { moment, users } = this.props
    const emotions = moment.get('emotions').get('users')

    const nodes = emotions.map(emotion => {
      const user = users.get(emotion.get('user_id'))

      return (
        <Emotion key={emotion.get('id')} emotion={emotion} user={user} />
      )
    })

    return (
      <div className='emotions'>
        {nodes}
      </div>
    )
  }

}

export default EmotionList
