import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import request from 'superagent'
import MomentJS from 'moment'

class FriendsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      friends: [],
      filter: ''
    }

    this.mergeFriendList = this.mergeFriendList.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const user = nextProps.user

    if (user.size > 0) {
      this.fetchFriendList(user.get('oauth_token'), user.get('id'))
    }
  }

  fetchFriendList(token, userId) {
    const url = '/api/v1/friends'
    const query = {
      user_id: userId,
      token: token
    }

    request
      .get(url)
      .query(query)
      .end((err, res) => {
        if (err || !res.ok) {
          console.log(err)
        } else {
          this.mergeFriendList(res.body)
        }
      })
  }

  mergeFriendList(data) {
    let friends = []

    data.friend_lists.ic.friend_ids.map(id => {
      const user = data.users[id]

      if (!user) return

      const name = `${user.first_name} ${user.last_name}`
      const photo = user.photo ? `${user.photo.url}/${user.photo.ios['2x'].file}` : ''

      const friend = {
        id: id,
        name: name,
        photo: photo,
        created_at: user.created_at
      }

      friends.push(friend)
    })

    friends.sort((a, b) => {
      return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)
    })

    this.setState({
      friends: friends
    })
  }

  handleChange(e) {
    this.setState({ filter: e.target.value })
  }

  render() {
    const { friends } = this.state

    let nodes = friends.map(friend => {
      if (friend.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1) return

      const timestamp = 'Joined Path since ' + MomentJS(friend.created_at).format('MMMM D, YYYY')

      return (
        <Link to={`/users/${friend.id}`} className='list-group-item' key={friend.id}>
          <div className='media-left'>
            <img alt={friend.name} src={friend.photo} className='friend-avatar' />
          </div>
          <div className='media-body'>
            <strong>{friend.name}</strong>
            <p className='timestamp'>{timestamp}</p>
          </div>
        </Link>
      )
    })

    if (nodes.length == 0) {
      nodes = <p className='lead text-center'>Loading...</p>
    }

    return (
      <div className='friends container'>
        <input type='text' className='form-control search-bar' placeholder='Search for...' onChange={this.handleChange} />
        <div className='list-group'>
          {nodes}
        </div>
      </div>
    )
  }

}

export default FriendsPage
