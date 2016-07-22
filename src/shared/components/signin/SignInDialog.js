import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import Alert from '../misc/Alert'

class SignInDialog extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      error: '',
      processing: false
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    $('#sign-in-dialog').on('shown.bs.modal', () => {
      $('#email').focus()
    })
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleRememberMeChange(e) {
    this.setState({ rememberMe: e.target.checked })
  }

  handleSubmit(e) {
    e.preventDefault()

    const email = this.state.email
    const password = this.state.password
    const rememberMe = this.state.rememberMe

    if (!email || !password) return

    this.setState({ processing: true })

    request
      .post('/api/v1/authenticate')
      .send({
        email: email,
        password: password
      })
      .end((err, res) => {
        this.setState({ processing: false })

        if (err || !res.ok) {
          this.setState({ error: JSON.parse(err.response.text) })
        } else {
          this.props.onSignIn(res.body, rememberMe)
        }
      })
  }

  render() {
    let alert = null

    if (this.state.error) {
      const message = 'Error: ' + this.state.error.display_message
      alert = <Alert type='danger' text={message} />
    }

    const { processing } = this.state

    return (
      <div id='sign-in-dialog' className='modal fade' tabIndex={-1}>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <form role='form' onSubmit={this.handleSubmit}>
              <div className='modal-header'>
                <h4 className='modal-title'>Sign in to Path</h4>
              </div>
              <div className='modal-body'>
                  {alert}
                  <div className='form-group'>
                    <label htmlFor='email'>Email:</label>
                    <input id='email' name='email' type='email' className='form-control' disabled={processing} onChange={this.handleEmailChange} />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input id='password' name='password' type='password' className='form-control' disabled={processing} onChange={this.handlePasswordChange} />
                  </div>
                  <div className='checkbox'>
                    <label>
                      <input type='checkbox' onChange={this.handleRememberMeChange} disabled={processing} /> Remember me
                    </label>
                  </div>
              </div>
              <div className='modal-footer'>
                <div className='copyright-info'>Copyright &copy; 2016 <a href='https://bekti.io'>Bekti I/O</a></div>
                <div className='modal-footer-right'>
                  <button type='submit' className='btn btn-success' disabled={processing}>Sign In</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

}

export default SignInDialog
