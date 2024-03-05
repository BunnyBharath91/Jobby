import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errMsg: '',
  }

  onUserNameChange = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onPasswordChange = event => {
    this.setState({
      password: event.target.value,
    })
  }

  renderUserName = username => (
    <>
      <label htmlFor="username" className="credential-label">
        USERNAME
      </label>
      <input
        placeholder="Username"
        type="text"
        id="username"
        className="input-bar"
        value={username}
        onChange={this.onUserNameChange}
      />
    </>
  )

  renderPassword = password => (
    <>
      <label htmlFor="password" className="credential-label">
        PASSWORD
      </label>
      <input
        placeholder="Password"
        type="password"
        id="password"
        className="input-bar"
        value={password}
        onChange={this.onPasswordChange}
      />
    </>
  )

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({
      showErrorMsg: true,
      errMsg,
    })
  }

  onSubmitDetails = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const details = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(details),
    }
    const url = 'https://apis.ccbp.in/login'

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrorMsg, errMsg} = this.state

    return (
      <div className="bg-container">
        <form className="form-container" onSubmit={this.onSubmitDetails}>
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
          />
          {this.renderUserName(username)}
          {this.renderPassword(password)}
          <button
            type="submit"
            className="submit-button"
            onClick={this.onSubmitDetails}
          >
            Login
          </button>
          {showErrorMsg && <p className="error-msg">{errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
