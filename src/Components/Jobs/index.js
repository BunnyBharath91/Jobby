import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
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
      employmentTypeList: [],
      jobsList: [],
      redirectToLogin: false,
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
    const {searchValue} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?search=${searchValue.toLowerCase()}`
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
    this.setState({
      searchValue: event.target.value,
    })
  }

  render() {
    const {
      userDetails,
      employmentTypeList,
      jobsList,
      searchValue,
      redirectToLogin,
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
            {this.renderProfileContainer(userDetails)}
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
              <FaSearch className="search-icon" />
            </div>
            <ul className="jobs-list">
              {jobsList.map(eachItem => this.renderJob(eachItem))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
