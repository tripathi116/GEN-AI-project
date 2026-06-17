import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import { useAuth } from '../../auth/hooks/useAuth';
import FadeIn from '../../../components/FadeIn';
import AnimatedHeading from '../../../components/AnimatedHeading';

const Home = () => {
  const { generateReport, loading, reports, deleteReport } = useInterview();
  const { handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  const handleDeleteReport = (report) => {
    setReportToDelete(report);
  };

  const handleFileClick = () => {
    resumeInputRef.current.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      resumeInputRef.current.files = files;
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0].name);
      // Force update by triggering state toggle
      setDragActive((prev) => !prev);
      setDragActive((prev) => !prev);
    }
  };

  // Loading Screen redesign
  if (loading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans flex items-center justify-center select-none">
        {/* Loader Glass Card */}
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center py-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-6"></div>
            <h1 className="text-xl font-medium text-white mb-2">Analyzing your profile...</h1>
            <p className="text-sm text-gray-400">Our AI is building your custom interview strategy. This will take about 30 seconds.</p>
          </div>
        </div>
      </main>
    );
  }

  const uploadedFileName = resumeInputRef.current?.files?.[0]?.name;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans flex flex-col select-none">
      {/* Main Layout Scrollable Container */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        
        {/* Logo Header */}
        <header className="w-full px-6 md:px-12 lg:px-16 pt-6 flex justify-between items-center">
          <div
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)] select-none hover:scale-[1.02] hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.85)] transition-all duration-300"
            onClick={() => navigate('/')}
          >
            HireReady
          </div>

          <div className="relative z-10 flex items-center">
            <button
              onClick={async () => {
                await handleLogout();
                navigate('/login');
              }}
              className="text-lg md:text-xl text-gray-400 hover:text-white transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 flex-1 flex flex-col justify-start">
          
          {/* Header Title */}
          <div className="mb-8 flex flex-col items-start">
            <AnimatedHeading
              text={`Create Your\nCustom Interview Plan`}
              className="text-3xl md:text-4xl lg:text-5xl font-normal mb-3 text-white leading-tight"
              style={{ letterSpacing: '-0.03em' }}
            />
            <FadeIn delay={400} duration={800}>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl font-light">
                Let our AI analyze the job requirements and your unique profile to build a winning strategy.
              </p>
            </FadeIn>
          </div>

          {/* Form Area */}
          <FadeIn delay={600} duration={800}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
              
              {/* Left Column: Job Description */}
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">Target Job Description</h2>
                  <span className="text-[10px] bg-white/10 text-white border border-white/15 px-2 py-0.5 rounded font-semibold">REQUIRED</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <textarea
                    onChange={(e) => setJobDescription(e.target.value)}
                    value={jobDescription}
                    name="jobDescription"
                    id="jobDescription"
                    placeholder="Paste the full job description here... (Responsibilities, Requirements, Company Overview)"
                    className="flex-1 min-h-[300px] bg-transparent border border-white/10 text-white rounded-xl p-4 placeholder:text-gray-400 focus:outline-none focus:border-white/30 transition-colors text-sm leading-relaxed resize-none builder-control-glow"
                  />
                </div>
              </div>

              {/* Right Column: Profile & Resume */}
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">Your Profile</h2>
                </div>
                
                {/* Resume Upload Drag & Drop */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-300">Upload Resume</span>
                    <span className="text-[9px] text-gray-400 font-medium">BEST RESULTS</span>
                  </div>
                  
                  <div
                    className={`builder-control-glow border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${dragActive ? 'builder-control-active bg-white/5 border-white/40 scale-[1.01]' : 'hover:bg-white/5 hover:border-white/30'}`}
                    onClick={handleFileClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-gray-400 mb-3">
                      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="8" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M24 16V28M18 22L24 16L30 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">
                      {uploadedFileName ? uploadedFileName : 'Click or drag to upload your Resume'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCs up to 10mb</p>
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
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="selfDescription" className="text-xs font-medium text-gray-300">
                    Quick Self-Description
                  </label>
                  <textarea
                    onChange={(e) => setSelfDescription(e.target.value)}
                    value={selfDescription}
                    id="selfDescription"
                    name="selfDescription"
                    placeholder="Briefly describe your relevant experience or specific areas you want the AI to focus on."
                    className="flex-1 min-h-[140px] bg-transparent border border-white/10 text-white rounded-xl p-4 placeholder:text-gray-400 focus:outline-none focus:border-white/30 transition-colors text-sm leading-relaxed resize-none builder-control-glow"
                  />
                </div>

              </div>

            </div>
          </FadeIn>

          {/* Footer Action Card */}
          <FadeIn delay={800} duration={800}>
            <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">AI-Powered Strategy Generation</span>
                <span className="text-xs text-gray-500 font-medium">APPROXIMATELY 30 SECONDS PROCESSING TIME</span>
              </div>
              <button
                onClick={handleGenerateReport}
                className="w-full md:w-auto liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all duration-300 text-sm md:text-base flex items-center justify-center"
              >
                Generate My Interview Strategy
              </button>
            </div>
          </FadeIn>

          {/* Recent Reports History */}
          {reports.length > 0 && (
            <FadeIn delay={1000} duration={800}>
              <section className="flex flex-col gap-6 mb-16">
                <h2 className="text-xl font-medium text-white tracking-tight">My Recent Interview Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      onClick={() => navigate(`/interview/${report._id}`)}
                      className="liquid-glass liquid-glass-hover-glow border border-white/10 hover:border-white/30 rounded-2xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <h3 className="text-lg font-medium text-white group-hover:text-gray-200 transition-colors line-clamp-1">
                            {report.title || 'Untitled Position'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            Generated on {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200"
                          title="Delete plan"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-medium">Match Score</span>
                          <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {report.matchScore >= 80 
                              ? 'Strong Match' 
                              : report.matchScore >= 50 
                                ? 'Moderate Match' 
                                : report.matchScore >= 40 
                                  ? 'Low Match' 
                                  : 'Weak Match'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                          {report.matchScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

        </div>

      </div>

      {/* Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="liquid-glass border border-white/20 rounded-2xl p-6 max-w-md w-full flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium text-white tracking-tight">Delete Interview Plan?</h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Are you sure you want to delete your interview plan for <strong className="text-white font-medium">{reportToDelete.title || 'Untitled Position'}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const idToDelete = reportToDelete._id;
                  setReportToDelete(null);
                  await deleteReport(idToDelete);
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 rounded-lg text-sm font-semibold text-red-200 hover:text-white transition-all duration-200 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
