import {Redirect, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  const onFindJobs = () => {
    const {history} = props
    history.push('/jobs')
    console.log('finding jobs')
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-bottom-container">
        <h1 className="main-heading">Find The Job That Fits Your Life </h1>
        <p className="sub-heading">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button type="button" className="find-jobs-button" onClick={onFindJobs}>
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default withRouter(Home)
