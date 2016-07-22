import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import request from 'superagent'
import MomentJS from 'moment'

class ActivityPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activities: [],
      locations: {},
      users: {}
    }

    this.mergeActivities = this.mergeActivities.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.user

    if (user.size > 0) {
      this.fetchActivity(user.get('oauth_token'))
    }
  }

  fetchActivity(token) {
    const url = '/api/v1/activity'
    const query = {
      token: token
    }

    request
      .get(url)
      .query(query)
      .end((err, res) => {
        if (err || !res.ok) {
          console.log(err)
        } else {
          this.mergeActivities(res.body)
        }
      })
  }

  mergeActivities(data) {
    this.setState({
      activities: data.activities,
      locations: data.locations,
      users: data.users
    })
  }

  getLocation(locationId) {
    const locationObj = this.state.locations[locationId]
    let location = null

    if (locationObj) {
      location = locationObj.location.city

      if (!location) location = locationObj.location.administrative_area_level_3
      if (!location) location = locationObj.location.administrative_area_level_2
      if (!location) location = locationObj.location.administrative_area_level_1
      if (!location) location = locationObj.location.province
      if (!location) location = locationObj.location.country
    }

    return location
  }

  render() {
    const { activities, locations, users } = this.state

    let nodes = activities.map(activity => {
      const uri = activity.url.split('/')
      const targetUrl = `/${uri[2]}/${uri[3]}`

      const actorUser = users[activity.actor_id]
      const actorUserName = `${actorUser.first_name} ${actorUser.last_name}`
      const actorAvatarUrl = actorUser.photo ? `${actorUser.photo.url}/${actorUser.photo.ios['2x'].file}` : ''
      const timestamp = MomentJS(activity.created_at * 1000).fromNow()
      const location = activity.location_id ? 'from ' + this.getLocation(activity.location_id) : ''

      return (
        <Link to={targetUrl} className='list-group-item' key={activity.id}>
          <div className='media-left'>
            <img alt={actorUserName} src={actorAvatarUrl} className='friend-avatar' />
          </div>
          <div className='media-body'>
            <span dangerouslySetInnerHTML={{__html: activity.activity_description}}></span>
            <p className='timestamp'>{timestamp} {location}</p>
          </div>
        </Link>
      )
    })

    if (nodes.length == 0) {
      nodes = <p className='lead text-center'>Loading...</p>
    }

    return (
      <div className='activity container'>
        <div className='list-group'>
          {nodes}
        </div>
      </div>
    )
  }

}

export default ActivityPage
