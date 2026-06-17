import React, { useState, useEffect } from 'react'
import "../styles/interview.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'



const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const { report, getReportById, loading } = useInterview()
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const handleDownloadResume = async () => {
    try {
      setResumeLoading(true)
      const serverURL = typeof window !== "undefined" && window.location.hostname === "localhost"
        ? ""
        : "https://hireready-36oz.onrender.com";

      const response = await axios.post(
        `${serverURL}/api/resume/${report._id}`,
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
    } finally {
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
      <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans flex items-center justify-center select-none">
        <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Generating Your Report</h1>
          <p className="text-sm text-gray-400">Our AI is analyzing your interview performance and creating personalized insights...</p>
        </div>
      </main>
    )
  }

  const getActiveContent = () => {
    switch (activeTab) {
      case 'technical':
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Technical Questions</h2>
              <p className="text-sm text-white/50">{report.technicalQuestions.length} questions · Practice with AI feedback</p>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-4">
              {report.technicalQuestions.map((q, idx) => {
                const itemId = `technical-${idx}`
                return (
                  <div key={itemId} className="group">
                    <button
                      onClick={() => toggleQuestion(itemId)}
                      className="w-full text-left px-5 py-4 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300 liquid-glass-hover-glow"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center min-w-8 h-8 rounded-lg text-xs font-bold text-black bg-white flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors line-clamp-2">{q.question}</p>
                        </div>
                        <span className={`text-white/50 transition-transform duration-300 flex-shrink-0 ${expandedQuestion === itemId ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>
                    {expandedQuestion === itemId && (
                      <div className="mt-2 space-y-2 pl-11 animate-in fade-in duration-300">
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 liquid-glass-hover-glow">
                          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Intention</p>
                          <p className="text-sm text-white/80 leading-relaxed">{q.intention}</p>
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 liquid-glass-hover-glow">
                          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Answer</p>
                          <p className="text-sm text-white/80 leading-relaxed">{q.answer}</p>
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
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Behavioral Questions</h2>
              <p className="text-sm text-white/50">{report.behavioralQuestions.length} questions · Focus on storytelling</p>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-4">
              {report.behavioralQuestions.map((q, idx) => {
                const itemId = `behavioral-${idx}`
                return (
                  <div key={itemId} className="group">
                    <button
                      onClick={() => toggleQuestion(itemId)}
                      className="w-full text-left px-5 py-4 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300 liquid-glass-hover-glow"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center min-w-8 h-8 rounded-lg text-xs font-bold text-black bg-white flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors line-clamp-2">{q.question}</p>
                        </div>
                        <span className={`text-white/50 transition-transform duration-300 flex-shrink-0 ${expandedQuestion === itemId ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </button>
                    {expandedQuestion === itemId && (
                      <div className="mt-2 space-y-2 pl-11 animate-in fade-in duration-300">
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 liquid-glass-hover-glow">
                          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Intention</p>
                          <p className="text-sm text-white/80 leading-relaxed">{q.intention}</p>
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 liquid-glass-hover-glow">
                          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Answer</p>
                          <p className="text-sm text-white/80 leading-relaxed">{q.answer}</p>
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
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Preparation Roadmap</h2>
              <p className="text-sm text-white/50">{report.preparationPlan.length} days · Daily tasks & milestones</p>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-4">
              {report.preparationPlan.map((plan) => (
                <div key={plan.day} className="group">
                  <button
                    onClick={() => toggleQuestion(`day-${plan.day}`)}
                    className="w-full text-left px-5 py-4 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300 liquid-glass-hover-glow"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center min-w-8 h-8 rounded-lg text-xs font-bold text-black bg-white flex-shrink-0">
                        {plan.day}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">{plan.focus}</p>
                      </div>
                      <span className={`text-white/50 transition-transform duration-300 flex-shrink-0 ${expandedQuestion === `day-${plan.day}` ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </button>
                  {expandedQuestion === `day-${plan.day}` && (
                    <div className="mt-2 pl-11 animate-in fade-in duration-300">
                      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 liquid-glass-hover-glow">
                        <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">Daily Tasks</p>
                        <ul className="space-y-2">
                          {plan.tasks.map((task, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-white/80">
                              <span className="text-white/50 flex-shrink-0">→</span>
                              <span>{task}</span>
                            </li>
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
    <main className="relative w-screen min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      {/* Scrollable Content */}
      <div className="relative z-10 w-full h-full flex flex-col">

        {/* Main Content Section */}
        <div className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 flex-1 flex flex-col">

          {/* Three Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Centered Page Title */}
            <div className="lg:col-span-4 flex justify-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white permanent-text-glow text-center">
                Interview Report
              </h1>
            </div>

            {/* Left Sidebar - Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-6 lg:min-h-[calc(100vh-16rem)] lg:flex lg:flex-col lg:justify-between lg:space-y-0">
                <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 h-fit">
                  <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-6">Sections</h3>
                  <nav className="space-y-6 mb-12">
                    {navigationItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-3 liquid-glass-hover-glow ${activeTab === item.id
                          ? 'liquid-glass border border-white/40 bg-white/10 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
                          }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                  <div className="h-px bg-white/10 mb-12"></div>
                  <button
                    onClick={() => navigate('/builder')}
                    className="w-full px-4 py-3 rounded-lg liquid-glass liquid-glass-hover-glow border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 text-sm"
                  >
                    ← New Interview
                  </button>
                </div>
 
                {/* Resume Download Button */}
                <div className="pt-6 lg:pt-0">
                  <button
                    onClick={handleDownloadResume}
                    disabled={resumeLoading}
                    className="w-full liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base text-center"
                  >
                    {resumeLoading ? 'Generating...' : 'ATS Tailored Resume Download'}
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <section className="lg:col-span-2">
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-8">
                {getActiveContent()}
              </div>
            </section>

            {/* Right Sidebar - Match Score & Skill Gaps */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Match Score Card */}
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 h-fit">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-6">Match Score</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      <circle
                        cx="60"
                        cy="60"
                        r="55"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="3"
                        style={{
                          strokeDasharray: `${(2 * Math.PI * 55 * report.matchScore) / 100} ${2 * Math.PI * 55}`,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '60px 60px',
                          transition: 'stroke-dasharray 0.5s ease'
                        }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#d1d5db" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{report.matchScore}</span>
                      <span className="text-xs text-white/50">%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Strong match</p>
                    <p className="text-xs text-white/50 mt-1">for this position</p>
                  </div>
                </div>
              </div>

              {/* Skill Gaps Card */}
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 h-fit">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">Key Gaps</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {report.skillGaps.length > 0 ? (
                    report.skillGaps.map((gap, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-xs font-medium text-white/70 truncate hover:bg-white/10 transition-all duration-300 liquid-glass-hover-glow"
                      >
                        {gap.skill}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-white/50 text-center py-4">No gaps identified</p>
                  )}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Interview
