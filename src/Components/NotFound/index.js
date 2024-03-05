import './index.css'

const NotFound = () => (
  <div className="wrong-path-container">
    <img
      alt="not found"
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      className="not-found-img"
    />
    <h1 className="failure-heading">Page Not Found</h1>
    <p className="failure-description">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
