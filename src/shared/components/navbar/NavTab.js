import React from 'react'
import { Link, IndexLink } from 'react-router'

class NavTab extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex)
    const LinkComponent = this.props.onlyActiveOnIndex ? IndexLink : Link

    const className = isActive ? 'active' : ''

    return (
      <li className={className} >
        <LinkComponent to={this.props.to} >{this.props.children}</LinkComponent>
      </li>
    )
  }

}

NavTab.contextTypes = {
  router: React.PropTypes.object
}

export default NavTab
