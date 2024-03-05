import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaSuitcase, FaSearchLocation} from 'react-icons/fa'

import './index.css'

class JobItemDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobDetails: {},
      similarJobsList: [],
    }
  }

  componentDidMount() {
    this.renderItemDetails()
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
        jobDescription: eachItem.description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(updatedSimilarJobsList)
      this.setState({
        jobDetails: updatedJobDetails,

        similarJobsList: updatedSimilarJobsList,
      })
    }
  }

  renderJobDetails = jobDetails => {
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
      <div className="job-card">
        <div className="job-card-upper-container">
          <img
            alt="company logo"
            src={companyLogoUrl}
            className="job-card-img"
          />
          <div className="role-rating-container">
            <h1 className="role">hi</h1>
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
          <a href={companyWebsiteUrl} to="_blank">
            Visit
          </a>
        </div>

        <p className="job-description">{jobDescription}</p>
      </div>
    )
  }

  renderSkills = skillsList => (
    <>
      <h1 className="skills-heading">Skills</h1>
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

  renderLifeAtCompany = lifeAtCompany => (
    <>
      <h1 className="skills-heading">Life at Company</h1>
      <div className="life-container">
        <p className="life-description">{lifeAtCompany.description}</p>
        <img alt="life img" src={lifeAtCompany.imageUrl} className="life-img" />
      </div>
    </>
  )

  renderSimilarJobs = similarJobsList => (
    <>
      <h1 className="skills-heading">Similar Jobs</h1>
      <ul className="similar-jobs-list">
        {similarJobsList.map(eachItem => (
          <li className="similar-job-item">
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
          </li>
        ))}
      </ul>
    </>
  )

  render() {
    const {jobDetails, similarJobsList} = this.state
    console.log(jobDetails, similarJobsList)

    return (
      <div className="job-item-container">
        {this.renderJobDetails(jobDetails)}
        {this.renderSkills(jobDetails.skills)}
        {this.renderLifeAtCompany(jobDetails.lifeAtCompany)}
        {this.renderSimilarJobs(similarJobsList)}
      </div>
    )
  }
}

export default JobItemDetails
