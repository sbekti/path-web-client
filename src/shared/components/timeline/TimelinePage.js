import React from 'react'
import ReactDOM from 'react-dom'
import { Map, Set } from 'immutable'
import request from 'superagent'
import Moment from './Moment'
import LoadMoreButton from './LoadMoreButton'

class TimelinePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      moments: Map(),
      locations: Map(),
      places: Map(),
      users: Map(),
      visibleMoments: Set(),
      lastMomentTimestamp: null,
      isLoading: false,
    }

    this.resetState = this.resetState.bind(this)
    this.refreshTimeline = this.refreshTimeline.bind(this)
    this.fetchTimeline = this.fetchTimeline.bind(this)
    this.fetchMoment = this.fetchMoment.bind(this)
    this.mergeTimeline = this.mergeTimeline.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.user

    if (user.size > 0) {
      this.fetchTimeline(user.get('oauth_token'))
    } else {
      this.resetState()
    }
  }

  componentDidMount() {
    const { user } = this.props

    if (user.size > 0) {
      this.fetchTimeline(user.get('oauth_token'))
    }

    this.refreshInterval = setInterval(() => {
      this.refreshTimeline()
    }, 30000)
  }

  componentWillUnmount() {
    this.resetState()
  }

  resetState() {
    this.setState({
      moments: Map(),
      locations: Map(),
      places: Map(),
      users: Map(),
      visibleMoments: Set(),
      lastMomentTimestamp: null,
      isLoading: false
    })

    if (this.refreshInterval) clearInterval(this.refreshInterval)
  }

  refreshTimeline() {
    const { moments, visibleMoments } = this.state
    const { user } = this.props

    if (user.size > 0) {
      let minTimestamp = null
      let maxTimestamp = null

      visibleMoments.forEach(momentId => {
        const timestamp = moments.get(momentId).get('created')

        if (!minTimestamp) {
          minTimestamp = timestamp
        } else {
          if (timestamp < minTimestamp) minTimestamp = timestamp
        }

        if (!maxTimestamp) {
          maxTimestamp = timestamp
        } else {
          if (timestamp > maxTimestamp) maxTimestamp = timestamp
        }
      })

      if (maxTimestamp) maxTimestamp = Math.round(maxTimestamp + 30)
      if (minTimestamp) minTimestamp = Math.round(minTimestamp - 1)

      this.fetchTimeline(user.get('oauth_token'), maxTimestamp, minTimestamp, true)
      this.fetchTimeline(user.get('oauth_token'), null, null, true)
    }
  }

  fetchTimeline(token, olderThan, newerThan, isRefresh) {
    if (!isRefresh) this.setState({ isLoading: true })
    const userId = this.props.params.userId

    let url = null
    let query = {
      token: token,
      older_than: olderThan,
      newer_than: newerThan
    }

    if (userId) {
      url = '/api/v1/feed'
      query.user_id = userId
    } else {
      url = '/api/v1/feed/home'
    }

    request
      .get(url)
      .query(query)
      .end((err, res) => {
        if (!isRefresh) this.setState({ isLoading: false })

        if (err || !res.ok) {
          console.log(err)
        } else {
          this.mergeTimeline(res.body)
        }
      })
  }

  fetchMoment(momentId) {
    const url = '/api/v1/moment'
    const query = {
      token: this.props.user.get('oauth_token'),
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

  handleLoadMore() {
    const { user } = this.props
    const { lastMomentTimestamp } = this.state

    this.fetchTimeline(user.get('oauth_token'), lastMomentTimestamp)
  }

  handleVisibilityChange(momentId, isVisible) {
    const { visibleMoments } = this.state
    let newVisibleMoments = null

    if (isVisible) {
      newVisibleMoments = visibleMoments.add(momentId)
    } else {
      newVisibleMoments = visibleMoments.delete(momentId)
    }

    this.setState({
      visibleMoments: newVisibleMoments
    })
  }

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
        <LoadMoreButton onClick={this.handleLoadMore} isLoading={this.state.isLoading} />
      </div>
    )
  }

}

export default TimelinePage
