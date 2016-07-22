import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import NavTab from './NavTab'

class NavBar extends React.Component {

  constructor(props) {
    super(props)

    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleSignOut(e) {
    this.props.onSignOut()
  }

  render() {
    let mainMenu = null
    let userMenu = null
    const user = this.props.user

    if (user.size > 0) {
      mainMenu = (
        <ul className='nav navbar-nav'>
          <NavTab to='/' onlyActiveOnIndex>Timeline</NavTab>
          <NavTab to='/activity' onlyActiveOnIndex>Activity</NavTab>
          <NavTab to='/friends' onlyActiveOnIndex>Friends</NavTab>
        </ul>
      )

      const avatarUrl = `${user.get('photo').get('url')}/${user.get('photo').get('ios').get('2x').get('file')}`

      userMenu = (
        <ul className='nav navbar-nav navbar-right'>
          <li className='dropdown'>
            <a className='dropdown-toggle' data-toggle='dropdown' role='button'>
              <img className='nav-avatar' alt={user.get('first_name')} src={avatarUrl} />
              {user.get('first_name')} <span className='caret' />
            </a>
            <ul className='dropdown-menu'>
              <li><Link to={`/users/${user.get('id')}`}>View Profile</Link></li>
              <li><Link to='/settings'>Settings</Link></li>
              <li role='separator' className='divider'></li>
              <li><Link to='/' onClick={this.handleSignOut}>Sign Out</Link></li>
            </ul>
          </li>
        </ul>
      )
    }

    return (
      <nav className='navbar navbar-default navbar-fixed-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
            <Link className='navbar-brand' to='/'>Path Web Client</Link>
          </div>
          <div id='navbar' className='collapse navbar-collapse'>
            {mainMenu}
            {userMenu}
          </div>
        </div>
      </nav>
    )
  }

}

export default NavBar
