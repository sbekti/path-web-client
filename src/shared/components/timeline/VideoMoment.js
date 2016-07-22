import React from 'react'
import ReactDOM from 'react-dom'

class VideoMoment extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { moment } = this.props
    const videoPreviewUrl = `${moment.get('video').get('photo').get('url')}/${moment.get('video').get('photo').get('ios').get('2x').get('file')}`
    const originalVideoUrl = `${moment.get('video').get('video').get('url')}/${moment.get('video').get('video').get('processed').get('file')}`
    const headline = moment.get('headline')

    return (
      <div className='media-embedded'>
        <a href={originalVideoUrl} target='_blank'>
          <img className='img-responsive' alt={headline} src={videoPreviewUrl} />
        </a>
      </div>
    )
  }

}

export default VideoMoment
