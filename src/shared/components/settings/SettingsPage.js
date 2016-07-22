import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import request from 'superagent'
import Cookies from 'js-cookie'

class SettingsPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      address: '',
      processing: false,
      spoofLocation: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.processSearchResult = this.processSearchResult.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const customGeo = nextProps.customGeo
    const realGeo = nextProps.realGeo

    if (this.state.spoofLocation) {
      if (customGeo.size > 0) {
        const latLng = L.latLng(customGeo.get('lat'), customGeo.get('lng'))
        this.marker.setLatLng(latLng)
        this.map.panTo(latLng)
      }
    } else {
      if (realGeo.size > 0) {
        const latLng = L.latLng(realGeo.get('lat'), realGeo.get('lng'))
        this.marker.setLatLng(latLng)
        this.map.panTo(latLng)
      }
    }
  }

  componentDidMount() {
    const spoofLocation = Cookies.get('spoof_location')

    this.setState({
      spoofLocation: spoofLocation ? spoofLocation === 'true' : false
    })

    let initialCoordinate = L.latLng(40.758896, -73.985130)

    const map = this.map = L.map('map').setView(initialCoordinate, 13)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
		}).addTo(map)

    const marker = this.marker = L.marker(initialCoordinate).addTo(map)
  }

  handleChange(e) {
    const address = e.target.value

    this.setState({
      address: address
    })
  }

  handleSearch(e) {
    e.preventDefault()
    this.setState({ processing: true })

    request
      .get('/api/v1/geolocation')
      .query({
        q: this.state.address
      })
      .end((err, res) => {
        this.setState({ processing: false })

        if (res && res.ok) {
          this.processSearchResult(res.body)
        }
      })
  }

  processSearchResult(results) {
    if (results.length > 0) {
      const result = results[0]

      const latLng = L.latLng(result.lat, result.lon)
      this.marker.setLatLng(latLng)
      this.map.panTo(latLng)

      Cookies.set('custom_geo', {
        lat: result.lat,
        lng: result.lon
      })
    }
  }

  handleLocationSpoofChange(e) {
    const spoofLocation = e.target.checked
    Cookies.set('spoof_location', spoofLocation)
  }

  render() {
    const { processing } = this.state

    return (
      <div className='settings container'>
        <h3>Location Settings</h3>
        <div className='checkbox'>
          <label>
            <input type='checkbox' onChange={this.handleLocationSpoofChange} defaultChecked={this.state.spoofLocation} /> Enable custom location
          </label>
        </div>
        <div className='search-bar'>
          <form onSubmit={this.handleSearch}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder='Enter address...' onChange={this.handleChange} disabled={processing} />
              <span className='input-group-btn'>
                <button type='submit' className='btn btn-default' disabled={processing}>Search</button>
              </span>
            </div>
          </form>
        </div>
        <div id='map'></div>
      </div>
    )
  }

}

export default SettingsPage
