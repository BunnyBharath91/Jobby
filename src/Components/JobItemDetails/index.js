import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaSuitcase, FaSearchLocation} from 'react-icons/fa'

import './index.css'

class JobItemDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      jobDetails: {},
      similarJobsList: [],
      fetchingStatus: 'LOADING',
    }
  }

  componentDidMount() {
    this.renderItemDetails()
    this.renderTitle()
  }

  renderTitle = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = 'https://apis.ccbp.in/jobs'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    const titleJob = data.jobs.filter(eachItem => eachItem.id === id)
    const updatedTitle = titleJob[0].title
    this.setState({
      title: updatedTitle,
    })
  }

  renderItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response.ok)
    console.log(data)
    if (response.ok) {
      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(eachItem => ({
          imageUrl: eachItem.image_url,
          name: eachItem.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      console.log(updatedJobDetails)

      const updatedSimilarJobsList = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(updatedSimilarJobsList)
      this.setState({
        jobDetails: updatedJobDetails,

        similarJobsList: updatedSimilarJobsList,
        fetchingStatus: 'SUCCESS',
      })
    } else {
      this.setState({
        fetchingStatus: 'FAILURE',
      })
    }
  }

  renderJobDetails = (jobDetails, title) => {
    if (!jobDetails) {
      return null
    }
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetails
    return (
      <>
        <div className="job-item-upper-container">
          <img
            alt="job details company logo"
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
        <div className="description-link-container">
          <h1 className="description-heading">Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
        </div>

        <p className="job-description">{jobDescription}</p>
      </>
    )
  }

  renderSkills = skillsList => {
    if (skillsList === undefined) {
      return null
    }
    return (
      <>
        <h1 className="description-heading">Skills</h1>
        <ul className="skills-container">
          {skillsList.map(eachItem => (
            <li className="skill-item">
              <img
                alt="skill"
                src={eachItem.imageUrl}
                className="skill-item-img"
              />
              <p className="skill-name">{eachItem.name}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderLifeAtCompany = lifeAtCompany => {
    if (lifeAtCompany === undefined) {
      return null
    }
    return (
      <>
        <h1 className="description-heading">Life at Company</h1>
        <div className="life-container">
          <p className="job-description life-description">
            {lifeAtCompany.description}
          </p>
          <img
            alt="life img"
            src={lifeAtCompany.imageUrl}
            className="life-img"
          />
        </div>
      </>
    )
  }

  renderSimilarJobs = similarJobsList => {
    const {jobDescription} = similarJobsList
    console.log(jobDescription)
    return (
      <>
        <h1 className="description-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsList.map(eachItem => (
            <li key={eachItem.id} className="similar-job-item">
              <div className="job-card-upper-container">
                <img
                  alt="company logo"
                  src={eachItem.companyLogoUrl}
                  className="job-card-img"
                />
                <div className="role-rating-container">
                  <h1 className="role">{eachItem.title}</h1>
                  <div className="rating-card">
                    <FaStar className="icon" />
                    {eachItem.rating}
                  </div>
                </div>
              </div>
              <h1 className="similar-job-description-heading">Description</h1>
              <p className="similar-job-description">
                {eachItem.jobDescription}
              </p>
              <div className="similar-job-item-bottom-container">
                <FaSearchLocation className="icon" />

                {eachItem.location}
                <FaSuitcase className="icon" />
                {eachItem.employmentType}
              </div>
            </li>
          ))}
        </ul>
      </>
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
        alt="failure"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.renderItemDetails}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {jobDetails, similarJobsList, title, fetchingStatus} = this.state
    console.log(jobDetails, similarJobsList)

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="job-item-container">
        {fetchingStatus === 'LOADING' && this.renderLoader()}
        {fetchingStatus === 'SUCCESS' && (
          <>
            <div className="job-item-main-container">
              {this.renderJobDetails(jobDetails, title)}
              {this.renderSkills(jobDetails.skills)}
              {this.renderLifeAtCompany(jobDetails.lifeAtCompany)}
            </div>
            {this.renderSimilarJobs(similarJobsList)}
          </>
        )}
        {fetchingStatus === 'FAILURE' && this.renderFailure()}
      </div>
    )
  }
}

export default JobItemDetails
