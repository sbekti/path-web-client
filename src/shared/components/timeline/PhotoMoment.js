import React from 'react'
import ReactDOM from 'react-dom'

class PhotoMoment extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { moment } = this.props
    const photoUrl = `${moment.get('photo').get('photo').get('url')}/${moment.get('photo').get('photo').get('ios').get('2x').get('file')}`
    const originalPhotoUrl = `${moment.get('photo').get('photo').get('url')}/${moment.get('photo').get('photo').get('original').get('file')}`
    const headline = moment.get('headline')

    return (
      <div className='media-embedded'>
        <a href={originalPhotoUrl} target='_blank'>
          <img className='img-responsive' alt={headline} src={photoUrl} />
        </a>
      </div>
    )
  }

}

export default PhotoMoment
