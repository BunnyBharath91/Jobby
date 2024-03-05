import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <header className="header-container">
      <img
        alt="website logo"
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        className="website-logo"
      />
      <ul className="header-components">
        <li className="header-element">
          <Link to="/" className="link-element">
            Home
          </Link>
        </li>
        <li className="header-element">
          <Link to="/jobs" className="link-element">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </header>
  )
}

export default withRouter(Header)
