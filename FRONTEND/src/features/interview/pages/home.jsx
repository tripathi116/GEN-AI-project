import React, {useState, useRef} from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
const Home = () => {

    const {generateReport, loading} = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [dragActive, setDragActive] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        if(data && data._id) {
        navigate(`/interview/${data._id}`)
    }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview report...</h1>
            </main>
        )
    }

    const handleFileClick = () => {
        resumeInputRef.current.click()
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        const files = e.dataTransfer.files
        if (files && files[0]) {
            resumeInputRef.current.files = files
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log("File selected:", e.target.files[0].name)
        }
    }


  return (
    <main className='home'>
      {/* Header Section */}
      <div className="header-section">
        <h1 className="main-title">
          Create Your <span className="highlight-text">Custom</span> Interview Plan
        </h1>
        <p className="subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      {/* Main Content */}
      <div className="interview-container">
        {/* Left Section - Job Description */}
        <div className="section-left">
          <div className="section-header">
            <h2>TARGET JOB DESCRIPTION</h2>
            <span className="badge required">REQUIRED</span>
          </div>
          <div className="input-wrapper">
            <textarea
              onChange={(e) => {setJobDescription(e.target.value)}}
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the full job description here... (Responsibilities, Requirements, Company Overview)"
              className="textarea-input"
            ></textarea>
          </div>
        </div>

        {/* Right Section - Profile & Resume */}
        <div className="section-right">
          <div className="section-header">
            <h2>YOUR PROFILE</h2>
          </div>

          {/* Resume Upload */}
          <div className="profile-group">
            <div className="group-header">
              <p>Upload Resume</p>
              <span className="badge best-results">BEST RESULTS</span>
            </div>
            <div 
              className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
              onClick={handleFileClick}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="8" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 16V28M18 22L24 16L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="upload-text">Click or drag to upload your Resume</p>
              <p className="upload-hint">PDF, DOCs up to 10mb</p>
              <input 
                ref={resumeInputRef} 
                hidden 
                type="file" 
                id="resume" 
                name="resume" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Self Description */}
          <div className="profile-group">
            <label htmlFor="selfDescription" className="group-header">
              Quick Self-Description
            </label>
            <textarea
                onChange={(e) => {setSelfDescription(e.target.value)}}
              id="selfDescription"
              name="selfDescription"
              placeholder="Briefly describe your relevant experience or specific areas you want the AI to focus on."
              className="textarea-input"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer-section">
        <div className="footer-left">
          <p className="footer-info">
            <span className="ai-badge">⚡ AI-POWERED STRATEGY GENERATION • APPROX 30S</span>
          </p>
        </div>
        <button 
          onClick ={handleGenerateReport}
          className="btn btn-primary">
          GENERATE MY INTERVIEW STRATEGY
          <span className="btn-icon">★</span>
        </button>
      </div>
    </main>
  )
}

export default Home