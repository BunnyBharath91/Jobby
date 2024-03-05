import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaSearch, FaStar, FaSuitcase, FaSearchLocation} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

class Jobs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      userDetails: '',
      selectedSalaryRange: '',
      employmentTypeList: [],
      jobsList: [],
      redirectToLogin: false,
      fetchingStatus: 'LOADING',
      fetchingUserDetailsStatus: 'LOADING',
    }
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      this.setState({
        redirectToLogin: true,
      })
    }
    this.renderUserDetails()
    this.renderJobs()
  }

  renderJobs = async () => {
    const {searchValue, selectedSalaryRange, employmentTypeList} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeList.join(
      ',',
    )}&minimum_package=${selectedSalaryRange}&search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedJobsList = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsList: updatedJobsList,
        fetchingStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        fetchingStatus: 'FAILURE',
      })
    }
  }

  renderUserDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      this.setState({
        userDetails: data.profile_details,
        fetchingUserDetailsStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        fetchingUserDetailsStatus: 'FAILURE',
      })
    }
  }

  renderProfileContainer = userDetails => (
    <div className="profile-container">
      <img
        alt="profile img"
        src={userDetails.profile_image_url}
        className="profile-img"
      />
      <h1 className="user-name">{userDetails.name}</h1>
      <p className="user-bio">{userDetails.short_bio}</p>
    </div>
  )

  onAddDeleteEmploymentType = event => {
    const {employmentTypeList} = this.state
    if (employmentTypeList.includes(event.target.id)) {
      this.setState(
        {
          employmentTypeList: employmentTypeList.filter(
            eachItem => eachItem !== event.target.id,
          ),
        },
        this.renderJobs,
      )
    } else {
      this.setState(
        {
          employmentTypeList: [...employmentTypeList, event.target.id],
        },
        this.renderJobs,
      )
    }
  }

  renderEmploymentTypeContainer = () => {
    const {employmentTypesList} = this.props
    console.log(employmentTypesList)
    return (
      <div className="employment-type-container">
        <h1 className="sorting-container-heading">Type of Employment</h1>
        <ul className="employment-type-list">
          {employmentTypesList.map(eachItem => (
            <li key={eachItem.employmentTypeId} className="employment-type">
              <input
                id={eachItem.employmentTypeId}
                type="checkbox"
                name="employment"
                className="employment-radio"
                onClick={this.onAddDeleteEmploymentType}
              />
              <label htmlFor={eachItem.employmentTypeId}>
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onSelectSalary = event => {
    console.log(event.target.id)
    this.setState({selectedSalaryRange: event.target.id}, this.renderJobs)
  }

  renderSalaryRangeContainer = () => {
    const {salaryRangesList} = this.props
    console.log(salaryRangesList)
    return (
      <div className="employment-type-container">
        <h1 className="sorting-container-heading">Salary Range</h1>
        <ul className="employment-type-list">
          {salaryRangesList.map(eachItem => (
            <li key={eachItem.salaryRangeId} className="employment-type">
              <input
                id={eachItem.salaryRangeId}
                type="radio"
                name="employment"
                className="employment-radio"
                onClick={this.onSelectSalary}
              />
              <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJob = jobItem => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      id,
      packagePerAnnum,
      rating,
      title,
    } = jobItem
    return (
      <Link key={id} to={`jobs/${id}`} className="link">
        <li className="job-card">
          <div className="job-card-upper-container">
            <img
              alt="company logo"
              src={companyLogoUrl}
              className="job-card-img"
            />
            <div className="role-rating-container">
              <h1 className="role">{title}</h1>
              <div className="rating-card">
                <FaStar className="icon" />
                {rating}
              </div>
            </div>
          </div>
          <div className="job-card-middle-container">
            <FaSearchLocation className="location" />
            {location}
            <FaSuitcase className="suitcase" />
            {employmentType}
            <span className="package-per-annum">{packagePerAnnum}</span>
          </div>
          <hr className="horizontal-line" />
          <h1 className="description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </li>
      </Link>
    )
  }

  onSearchChange = event => {
    this.setState(
      {
        searchValue: event.target.value,
      },
      this.renderJobs,
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.renderJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobs = () => (
    <div className="failure-container">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  render() {
    const {
      userDetails,
      employmentTypeList,
      jobsList,
      searchValue,
      redirectToLogin,
      fetchingStatus,
      fetchingUserDetailsStatus,
    } = this.state
    console.log(employmentTypeList)

    if (redirectToLogin) {
      return <Redirect to="/login" />
    }
    return (
      <div className="jobs-container">
        <Header />
        <div className="bottom-container">
          <div className="profile-sorting-container">
            {fetchingUserDetailsStatus === 'LOADING' && this.renderLoader()}
            {fetchingUserDetailsStatus === 'FAILURE' && (
              <button
                type="button"
                className="retry-button"
                onClick={this.renderUserDetails}
              >
                Retry
              </button>
            )}
            {fetchingUserDetailsStatus === 'SUCCESS' &&
              this.renderProfileContainer(userDetails)}
            <hr className="horizontal-line" />
            {this.renderEmploymentTypeContainer()}
            <hr className="horizontal-line" />
            {this.renderSalaryRangeContainer()}
          </div>
          <div className="jobs-list-container">
            <div className="search-container">
              <input
                placeholder="Search"
                type="search"
                className="jobs-search-input-bar"
                value={searchValue}
                onChange={this.onSearchChange}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.renderJobs}
                label="search icon"
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
            <ul className="jobs-list">
              {fetchingStatus === 'LOADING' && this.renderLoader()}
              {fetchingStatus === 'SUCCESS' && jobsList.length === 0
                ? this.renderNoJobs()
                : jobsList.map(eachItem => this.renderJob(eachItem))}
              {fetchingStatus === 'FAILURE' && this.renderFailure()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
