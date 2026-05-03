import React, { useState, useEffect } from 'react'
import "../styles/interview.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'



const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const {report, getReportById, loading} = useInterview()
  const {interviewId} = useParams()
  const navigate = useNavigate()

    const handleDownloadResume = async () => {
    try {
        setResumeLoading(true) 
        const response = await axios.post(
            `https://hireready-36oz.onrender.com/api/resume/${report._id}`,
            {},
            {
                responseType: 'blob',
                withCredentials: true
            }
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'tailored-resume.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error(error)
    }finally {
        setResumeLoading(false)  
    }
  }

  useEffect(() => {
    if (interviewId) {
      if (!report || report._id !== interviewId) {
            getReportById(interviewId)
        }
    }
  }, [interviewId])

  const navigationItems = [
    { id: 'technical', label: 'Technical Questions', icon: '◄►' },
    { id: 'behavioral', label: 'Behavioral Questions', icon: '□' },
    { id: 'roadmap', label: 'Road Map', icon: '✓' }
  ]

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  if (loading || !report) {
    return (
        <main className='loading-screen'>
            <h1>Loading your interview report...</h1>
        </main>
    )
  }

  const getActiveContent = () => {
    switch(activeTab) {
      case 'technical':
        return (
          <div className="content-section">
            <div className="section-header-main">
              <h2 className="section-title">Technical Questions</h2>
              <span className="question-count">{report.technicalQuestions.length} questions</span>
            </div>
            <div className="accordion-list">
              {report.technicalQuestions.map((q, idx) => {
                const itemId = `technical-${idx}`
                return (
                  <div key={itemId} className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => toggleQuestion(itemId)}
                    >
                      <span className="question-number">Q{idx + 1}</span>
                      <span className="question-title">{q.question}</span>
                      <span className={`accordion-icon ${expandedQuestion === itemId ? 'open' : ''}`}>▼</span>
                    </button>
                    {expandedQuestion === itemId && (
                      <div className="accordion-content">
                        <div className="answer-section">
                          <p className="answer-label">Intention</p>
                          <p className="answer-text">{q.intention}</p>
                        </div>
                        <div className="answer-section">
                          <p className="answer-label">Answer</p>
                          <p className="answer-text">{q.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      case 'behavioral':
        return (
          <div className="content-section">
            <div className="section-header-main">
              <h2 className="section-title">Behavioral Questions</h2>
              <span className="question-count">{report.behavioralQuestions.length} questions</span>
            </div>
            <div className="accordion-list">
              {report.behavioralQuestions.map((q, idx) => {
                const itemId = `behavioral-${idx}`
                return (
                  <div key={itemId} className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => toggleQuestion(itemId)}
                    >
                      <span className="question-number">Q{idx + 1}</span>
                      <span className="question-title">{q.question}</span>
                      <span className={`accordion-icon ${expandedQuestion === itemId ? 'open' : ''}`}>▼</span>
                    </button>
                    {expandedQuestion === itemId && (
                      <div className="accordion-content">
                        <div className="answer-section">
                          <p className="answer-label">Intention</p>
                          <p className="answer-text">{q.intention}</p>
                        </div>
                        <div className="answer-section">
                          <p className="answer-label">Answer</p>
                          <p className="answer-text">{q.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      case 'roadmap':
        return (
          <div className="content-section">
            <div className="section-header-main">
              <h2 className="section-title">Preparation Road Map</h2>
              <span className="question-count">{report.preparationPlan.length} days</span>
            </div>
            <div className="accordion-list">
              {report.preparationPlan.map((plan) => (
                <div key={plan.day} className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleQuestion(`day-${plan.day}`)}
                  >
                    <span className="question-number">Day {plan.day}</span>
                    <span className="question-title">{plan.focus}</span>
                    <span className={`accordion-icon ${expandedQuestion === `day-${plan.day}` ? 'open' : ''}`}>▼</span>
                  </button>
                  {expandedQuestion === `day-${plan.day}` && (
                    <div className="accordion-content">
                      <div className="tasks-section">
                        <p className="answer-label">Tasks</p>
                        <ul className="tasks-list">
                          {plan.tasks.map((task, idx) => (
                            <li key={idx} className="task-item">{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="interview-report">
      <div className="report-container">
        {/* Left Sidebar - Navigation */}
        <aside className="sidebar sidebar-left">
          <div className="sidebar-content">
            <h3 className="sidebar-label">SECTIONS</h3>
            <nav className="navigation-menu">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <button 
              onClick={() => navigate('/')}
              className="home-btn">
               Home
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="main-content">
          {getActiveContent()}
        </section>

        {/* Right Sidebar - Match Score & Skill Gaps */}
        <aside className="sidebar sidebar-right">
          <div className="sidebar-content">
            {/* Match Score */}
            <div className="match-score-section">
              <h3 className="sidebar-label">MATCH SCORE</h3>
              <div className="circular-score">
                <svg className="score-circle" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="55" className="score-bg" />
                  <circle cx="60" cy="60" r="55" className="score-fill" 
                  style={{
                    strokeDashoffset: `calc(172.78 - (172.78 * ${report.matchScore}) / 100)`
                  }}/>
                </svg>
                <div className="score-content">
                  <span className="score-value">{report.matchScore}</span>
                </div>
              </div>
              <p className="score-status">Strong match for this role</p>
            </div>

            {/* Skill Gaps */}
            <div className="skill-gaps-section">
              <h3 className="sidebar-label">SKILL GAPS</h3>
              <div className="skill-gaps-container">
                {report.skillGaps.map((gap, idx) => (
                  <span
                    key={idx}
                    className={`skill-tag severity-${gap.severity}`}
                  >
                    {gap.skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="download-section">
              <button 
                onClick={handleDownloadResume}
                disabled={resumeLoading}
                className="download-btn">
                {resumeLoading ? '⏳ Downloading your resume, please wait...' : ' Download Tailored Resume'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
