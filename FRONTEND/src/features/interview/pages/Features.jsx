import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import FadeIn from '../../../components/FadeIn';

const Features = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (user) {
      navigate('/builder');
    } else {
      navigate('/login');
    }
  };

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

        {/* Centered Content Area */}
        <div className="flex-1 flex items-center justify-center px-6">
          <FadeIn delay={200} duration={800}>
            <div className="w-full max-w-2xl">
              <div className="liquid-glass liquid-glass-hover-glow border border-white/20 rounded-2xl p-8 md:p-10 flex flex-col gap-8 relative">

                {/* Header */}
                <div className="flex flex-col gap-1 text-left">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                    What HireReady Does
                  </h2>
                  <p className="text-sm text-gray-400">
                    Your AI-powered personalized preparation companion designed to land your dream job.
                  </p>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-6 my-2">

                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-white w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">1</div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-white">What is HireReady?</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">An AI-powered preparation companion designed to analyze job requirements, evaluate your background profile, and build personalized prep plans to land your target role.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-white w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">2</div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-white">How It Works</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Simply paste any job description, upload your resume, and let our AI instantly compute profile alignment, diagnose skill gaps, and construct your study guide.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-white w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">3</div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-white">Custom Roadmap & Guides</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Receive a customized day-by-day learning roadmap alongside targeted technical and behavioral practice interview question guides.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-white w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">4</div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-white">Tailored Resume Download</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">Instantly download an AI-tailored resume customized with highlighted key skills to match the target position.</p>
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <button
                    onClick={() => navigate('/')}
                    className="liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-all duration-300"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={handleStartChat}
                    className="liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-all duration-300"
                  >
                    Build My Plan Now
                  </button>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};

export default Features;
