import React from 'react'
import ReactDOM from 'react-dom'
import { Map, Set } from 'immutable'
import request from 'superagent'
import Moment from './Moment'

class MomentPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      moments: Map(),
      locations: Map(),
      places: Map(),
      users: Map()
    }

    this.resetState = this.resetState.bind(this)
    this.fetchMoment = this.fetchMoment.bind(this)
    this.mergeTimeline = this.mergeTimeline.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.user

    if (user.size > 0) {
      const momentId = this.props.params.momentId
      this.fetchMoment(momentId, user.get('oauth_token'))
    } else {
      this.resetState()
    }
  }

  componentDidMount() {
    const { user } = this.props

    if (user.size > 0) {
      const momentId = this.props.params.momentId
      this.fetchMoment(momentId, user.get('oauth_token'))
    }
  }

  componentWillUnmount() {
    this.resetState()
  }

  resetState() {
    this.setState({
      moments: Map(),
      locations: Map(),
      places: Map(),
      users: Map()
    })
  }

  fetchMoment(momentId, token) {
    const url = '/api/v1/moment'
    const query = {
      token: token ? token : this.props.user.get('oauth_token'),
      id: momentId
    }

    request
      .get(url)
      .query(query)
      .end((err, res) => {
        if (err || !res.ok) {
          console.log(err)
        } else {
          this.mergeTimeline(res.body)
        }
      })
  }

  mergeTimeline(data) {
    const { lastMomentTimestamp } = this.state
    const moments = {}

    for (const moment of data.moments) {
      moments[moment.id] = moment
      const timestamp = moment.created

      if (!lastMomentTimestamp || timestamp < lastMomentTimestamp) {
        this.setState({
          lastMomentTimestamp: timestamp
        })
      }
    }

    this.setState({
      locations: this.state.locations.merge(data.locations),
      places: this.state.places.merge(data.places),
      users: this.state.users.merge(data.users),
      moments: this.state.moments.merge(moments)
    })
  }

  handleVisibilityChange() {}

  render() {
    const { moments, locations, places, users } = this.state

    const nodes = moments
                    .sortBy(moment => -moment.get('created'))
                    .toList()
                    .map(moment => {
      const author = users.get(moment.get('user_id'))

      return (
        <Moment
          key={moment.get('id')}
          moment={moment}
          author={author}
          users={users}
          locations={locations}
          user={this.props.user}
          onVisibilityChange={this.handleVisibilityChange}
          onCommentSubmitted={this.fetchMoment}
          onEmotionClick={this.fetchMoment}
          customGeo={this.props.customGeo}
          realGeo={this.props.realGeo}
        ></Moment>
      )
    })

    return (
      <div className='feed container'>
        <ul className='media-list'>
          {nodes}
        </ul>
      </div>
    )
  }

}

export default MomentPage
