import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../shared/components/App'
import TimelinePage from '../shared/components/timeline/TimelinePage'
import ActivityPage from '../shared/components/activity/ActivityPage'
import FriendsPage from '../shared/components/friends/FriendsPage'
import MomentPage from '../shared/components/timeline/MomentPage'
import SettingsPage from '../shared/components/settings/SettingsPage'
import NotFoundPage from '../shared/components/misc/NotFoundPage'

function createElement(Component, props) {
  const key = props.location.pathname

  return <Component key={key} {...props} />
}

render((
  <Router history={browserHistory} createElement={createElement}>
    <Route path='/' component={App}>
      <IndexRoute component={TimelinePage} />
      <Route path='users/:userId' component={TimelinePage} />
      <Route path='activity' component={ActivityPage} />
      <Route path='friends' component={FriendsPage} />
      <Route path='settings' component={SettingsPage} />
      <Route path='moments/:momentId' component={MomentPage} />
      <Route path='*' component={NotFoundPage} />
    </Route>
  </Router>
), document.getElementById('root'))
