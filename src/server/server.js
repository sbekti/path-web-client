import path from 'path'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import request from 'superagent'
import PathClient from '../shared/lib/path-client'

const app = express()
const server = http.Server(app)

app.set('env', process.env.NODE_ENV || 'development')
app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 5000)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../../assets')))
app.use('/scripts', express.static(path.join(__dirname, '../../dist')))

app.post('/api/v1/authenticate', (req, res) => {
  PathClient
    .authenticate({
      email: req.body.email,
      password: req.body.password
    })
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      res
        .status(err.response.status)
        .json(JSON.parse(err.response.text))
    })
})

app.get('/api/v1/feed', (req, res) => {
  const pathClient = new PathClient(req.query.token)

  pathClient
    .getUserFeed({
      userId: req.query.user_id,
      limit: req.query.limit,
      olderThan: req.query.older_than,
      newerThan: req.query.newer_than
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })

  // res.json(test)
})

app.get('/api/v1/feed/home', (req, res) => {
  const pathClient = new PathClient(req.query.token)

  pathClient
    .getHomeFeed({
      limit: req.query.limit,
      olderThan: req.query.older_than,
      newerThan: req.query.newer_than
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })

  // res.json(test)
})

app.get('/api/v1/moment', (req, res) => {
  const pathClient = new PathClient(req.query.token)

  pathClient
    .getMoment({
      id: req.query.id
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })

  // res.json(test)
})

app.post('/api/v1/comments/add', (req, res) => {
  const pathClient = new PathClient(req.body.token)

  pathClient
    .addComment({
      momentId: req.body.moment_id,
      body: req.body.body,
      lat: req.body.lat,
      lng: req.body.lng
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.post('/api/v1/emotion/add', (req, res) => {
  const pathClient = new PathClient(req.body.token)

  pathClient
    .addEmotion({
      momentId: req.body.moment_id,
      emotionType: req.body.emotion_type,
      lat: req.body.lat,
      lng: req.body.lng
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.get('/api/v1/friends', (req, res) => {
  const pathClient = new PathClient(req.query.token)

  pathClient
    .getFriends({
      userId: req.query.user_id
    })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.get('/api/v1/activity', (req, res) => {
  const pathClient = new PathClient(req.query.token)

  pathClient
    .getActivity({})
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.get('/api/v1/geolocation', (req, res) => {
  const url = 'http://nominatim.openstreetmap.org/search'

  const query = {
    q: req.query.q,
    format: 'json'
  }

  request
    .get(url)
    .query(query)
    .end((err, response) => {
      if (response && response.ok) {
        res.json(response.body)
      } else {
        res.send(err)
      }
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../assets', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log('Error on request %s %s', req.method, req.url)
  console.log(err)
  console.log(err.stack)
  res.status(500).send('Internal server error')
})

server.listen(app.get('port'), () => {
  console.log('Express %s server listening on %s:%s',
    app.get('env'),
    app.get('host'),
    app.get('port')
  )
})
