import React, { useState } from 'react'
import "../styles/interview.scss"
import { useInterview } from '../hooks/useInterview.js'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const {report} = useInterview()
  

  const navigationItems = [
    { id: 'technical', label: 'Technical Questions', icon: '◄►' },
    { id: 'behavioral', label: 'Behavioral Questions', icon: '□' },
    { id: 'roadmap', label: 'Road Map', icon: '✓' }
  ]

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
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
              {report.technicalQuestions.map((q) => (
                <div key={q.id} className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <span className="question-number">Q{q.id + 1}</span>
                    <span className="question-title">{q.question}</span>
                    <span className={`accordion-icon ${expandedQuestion === q.id ? 'open' : ''}`}>▼</span>
                  </button>
                  {expandedQuestion === q.id && (
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
              ))}
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
              {report.behavioralQuestions.map((q) => (
                <div key={q.id} className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <span className="question-number">Q{q.id + 1}</span>
                    <span className="question-title">{q.question}</span>
                    <span className={`accordion-icon ${expandedQuestion === q.id ? 'open' : ''}`}>▼</span>
                  </button>
                  {expandedQuestion === q.id && (
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
              ))}
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
                  <circle cx="60" cy="60" r="55" className="score-fill" />
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
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
