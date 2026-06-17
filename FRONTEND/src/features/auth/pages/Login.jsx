import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import FadeIn from '../../../components/FadeIn';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate('/builder');
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans flex items-center justify-center select-none">
      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <FadeIn delay={200} duration={800}>
          <div className="liquid-glass border border-white/20 rounded-2xl p-8 md:p-10 flex flex-col gap-6 liquid-glass-hover-glow">

            {/* Header */}
            <div className="flex flex-col gap-1 text-center">
              <span
                className="text-3xl font-bold tracking-tight cursor-pointer bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] select-none hover:scale-[1.02] hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-all duration-300 mb-2"
                onClick={() => navigate('/')}
              >
                HireReady
              </span>
              <h2 className="text-lg text-gray-300 font-light">Welcome back. Enter your credentials to continue.</h2>
            </div>

            {/* Form */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                <p className="text-sm text-gray-400">Loading your profile...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="liquid-glass border border-white/20 text-white rounded-lg px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors w-full text-sm animate-none bg-transparent liquid-input-glow"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300 mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="liquid-glass border border-white/20 text-white rounded-lg px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors w-full text-sm animate-none bg-transparent liquid-input-glow"
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="liquid-glass liquid-glass-hover-glow border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/5 transition-all duration-300 text-sm mt-2 w-full"
                >
                  Login
                </button>
              </form>
            )}

            {/* Bottom Redirect */}
            <div className="text-center text-sm text-gray-400 mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline transition-all">
                Register
              </Link>
            </div>

          </div>
        </FadeIn>
      </div>
    </main>
  );
};

export default Login;