import React from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import FadeIn from '../../../components/FadeIn';
import AnimatedHeading from '../../../components/AnimatedHeading';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (user) {
      navigate('/builder');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans select-none">
      {/* Main Content Layout Wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        
        {/* Logo Header */}
        <header className="w-full px-6 md:px-12 lg:px-16 pt-6 flex justify-between items-center">
          <div 
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)] select-none hover:scale-[1.02] hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.85)] transition-all duration-300" 
            onClick={() => navigate('/')}
          >
            HireReady
          </div>

          {/* Right User Greeting */}
          <div className="relative z-10 flex items-center">
            {user ? (
              <span className="text-lg md:text-xl text-gray-300 font-light hidden sm:inline">
                Welcome back, <span className="text-white font-semibold">{user.username || 'User'}</span>
              </span>
            ) : (
              <Link to="/login" className="text-lg md:text-xl text-gray-400 hover:text-white transition-colors font-medium">
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Hero Content (Bottom of viewport) */}
        <div className="w-full px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex-1 flex flex-col justify-end">
          <div className="lg:grid lg:grid-cols-2 lg:items-end gap-12">
            
            {/* Left Column - Main Content */}
            <div className="flex flex-col items-start">
              {/* Heading */}
              <AnimatedHeading
                text={`Shaping your career\nwith vision and strategy.`}
                className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4 text-white leading-[1.2]"
                style={{ letterSpacing: '-0.04em' }}
              />

              {/* Subheading */}
              <FadeIn delay={800} duration={1000} className="w-full">
                <p className="text-base md:text-lg text-gray-300 mb-5 max-w-xl">
                  We analyze your profile and craft personalized preparation strategies that define what comes next.
                </p>
              </FadeIn>

              {/* Buttons Row */}
              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/features')}
                    className="liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all duration-300 text-sm md:text-base"
                  >
                    What we do
                  </button>
                  <button
                    onClick={handleStartChat}
                    className="liquid-glass liquid-glass-hover-glow border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all duration-300 text-sm md:text-base"
                  >
                    Build Interview Plan
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Tag */}
            <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                  <span className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-white">
                    Analyze. Strategize. Succeed.
                  </span>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default Landing;
