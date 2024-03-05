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
      <Link to="/" className="link-element">
        <img
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
        />
      </Link>

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
        <li className="header-element logout-button-container">
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </header>
  )
}

export default withRouter(Header)
