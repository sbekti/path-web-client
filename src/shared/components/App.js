import React from 'react'
import Immutable, { Map } from 'immutable'
import Cookies from 'js-cookie'
import NavBar from './navbar/NavBar'
import SignInDialog from './signin/SignInDialog'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      user: Map(),
      customGeo: Map(),
      realGeo: Map()
    }

    this.getLocation = this.getLocation.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  componentDidMount() {
    this.getLocation()

    const user = Cookies.getJSON('user')
    const customGeo = Cookies.getJSON('custom_geo')

    if (customGeo) {
      this.setState({
        customGeo: Immutable.fromJS(customGeo)
      })
    }

    if (user) {
      this.setState({
        user: Immutable.fromJS(user)
      })

      return
    }

    this.showSignInDialog()
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const realGeo = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        this.setState({
          realGeo: Immutable.fromJS(realGeo)
        })
      })
    }
  }

  handleSignIn(user, rememberMe) {
    this.setState({ user: Immutable.fromJS(user) })

    if (rememberMe) {
      Cookies.set('user', user, { expires: 30 })
    } else {
      Cookies.set('user', user)
    }

    this.hideSignInDialog()
  }

  handleSignOut() {
    Cookies.remove('user')
    Cookies.remove('custom_geo')
    Cookies.remove('spoof_location')

    this.setState({
      user: Map(),
      customGeo: Map(),
      realGeo: Map()
    })

    this.showSignInDialog()
  }

  showSignInDialog() {
    $('#sign-in-dialog').modal({
      backdrop: 'static',
      keyboard: false
    })
  }

  hideSignInDialog() {
    $('#sign-in-dialog').modal('hide')
  }

  render() {
    let childWithProps = React.cloneElement(this.props.children, {
      user: this.state.user,
      customGeo: this.state.customGeo,
      realGeo: this.state.realGeo
    })

    return (
      <div className='wrap'>
        <NavBar activeTab={this.state.activeTab} user={this.state.user} onSignOut={this.handleSignOut} />
        <SignInDialog onSignIn={this.handleSignIn} />
        {childWithProps}
      </div>
    )
  }

}

export default App
