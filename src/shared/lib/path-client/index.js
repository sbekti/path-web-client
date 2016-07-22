import request from 'superagent'

const CLIENT_ID = 'MzVhMzQ4MTEtZWU2Ni00MzczLWE5NTItNTBhYjJlMzE0YTgz'

export default class PathClient {

  constructor(token) {
    this._token = token
  }

  static authenticate(params) {
    const url = 'https://api.path.com/3/user/authenticate'

    const formData = {
      post: JSON.stringify({
        login: params.email,
        password: params.password,
        client_id: CLIENT_ID,
        reactivate_user: 1
      })
    }

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('form')
        .send(formData)
        .end((err, res) => {
          if (err || !res.ok) {
            reject(err)
          } else {
            resolve(res.body)
          }
        })
    })
  }

  getHomeFeed(params) {
    const url = 'https://api.path.com/3/moment/feed/home?'
    params.url = url

    return this._getFeed(params)
  }

  getUserFeed(params) {
    const url = 'https://api.path.com/3/moment/feed?'
    params.url = url

    return this._getFeed(params)
  }

  getMoment(params) {
    let url = 'https://api.path.com/3/moment?'
    url += 'include_user_settings=true'
    url += '&id=' + params.id
    url += '&oauth_token=' + this._token
    url += '&gs=1'

    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  updateLocation(lat, lng, accuracy, elevation) {
    const url = 'https://api.path.com/3/location/update'

    const formData = {
      post: JSON.stringify({
        lat: lat,
        lng: lng,
        accuracy: accuracy,
        evelcation: elevation,
        oauth_token: this._token
      })
    }

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('form')
        .send(formData)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  addComment(params) {
    const url = 'https://api.path.com/3/moment/comments/add'
    params.url = url

    return this._addComment(params)
  }

  addEmotion(params) {
    const url = 'https://api.path.com/3/moment/emotion/add'
    params.url = url

    return this._addEmotion(params)
  }

  getFriends(params) {
    const url = 'https://api.path.com/3/user/friends?'
    params.url = url

    return this._getFriends(params)
  }

  getActivity(params) {
    const url = 'https://api.path.com/4/activity?'
    params.url = url

    return this._getActivity(params)
  }

  _getFeed(params) {
    let url = params.url

    if (params.limit) {
      url += 'limit=' + params.limit
    } else {
      url += 'limit=' + 20
    }

    url += '&oauth_token=' + this._token
    url += '&gs=1'

    if (params.olderThan) {
      url += '&older_than=' + params.olderThan
    }

    if (params.newerThan) {
      url += '&newer_than=' + params.newerThan
    }

    if (params.userId) {
      url += '&user_id=' + params.userId
    }

    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  _addComment(params) {
    let url = params.url

    let body = {
      moment_id: params.momentId,
      body: params.body,
      oauth_token: this._token
    }

    if (params.lat && params.lng) {
      body.location = {
        lat: params.lat,
        lng: params.lng,
        distance: 20.0
      }
    }

    const formData = {
      post: JSON.stringify(body)
    }

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('form')
        .send(formData)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  _addEmotion(params) {
    let url = params.url

    let body = {
      moment_id: params.momentId,
      emotion_type: params.emotionType,
      oauth_token: this._token
    }

    if (params.lat && params.lng) {
      body.locaton = {
        lat: params.lat,
        lng: params.lng,
        distance: 20.0
      }
    }

    const formData = {
      post: JSON.stringify(body)
    }

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .type('form')
        .send(formData)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  _getFriends(params) {
    let url = params.url
    url += '&user_id=' + params.userId
    url += '&oauth_token=' + this._token

    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

  _getActivity(params) {
    let url = params.url
    url += '&limit=150'
    url += '&timehop=false'
    url += '&birthday=false'
    url += '&birthday_collection=false'
    url += '&oauth_token=' + this._token

    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (res && res.ok) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
    })
  }

}
