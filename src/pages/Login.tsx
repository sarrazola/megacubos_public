import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';

// Generate random values outside component
const cubes = [...Array(8)].map((_, i) => ({
  left: `${Math.random() * 80}%`,
  top: `${Math.random() * 80}%`,
  rotation: Math.random() * 360,
  isBlue: Math.random() > 0.5
}));

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      setError('Invalid email or password');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center mb-8">
            <img 
              src="https://mvkcdelawgnlxqqsjboh.supabase.co/storage/v1/object/public/static_content/Logo.png"
              alt="Megacubos Logo"
              className="h-12 w-12"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Log in to your account below
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-blue-600 rounded-lg shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Grid Pattern with Content */}
      <div className="hidden lg:block lg:w-1/2 bg-[#0F172A] relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight">
              <span className="text-white">Crea.</span>{' '}
              <span className="text-white">Conecta.</span>{' '}
              <br />
              <span className="text-blue-400">Despliega.</span>
            </h1>
          </div>
        </div>

        {/* Animated Floating Cubes */}
        {cubes.map((cube, i) => (
          <div
            key={i}
            className="absolute backdrop-blur-sm border border-white/10 rounded-xl"
            style={{
              animation: `float-${i} ${15 + i * 2}s infinite linear`,
              background: `linear-gradient(135deg, 
                ${cube.isBlue ? 'rgba(96, 165, 250, 0.1)' : 'rgba(139, 92, 246, 0.1)'} 0%,
                rgba(30, 41, 59, 0.2) 100%)`,
              width: '120px',
              height: '120px',
              left: cube.left,
              top: cube.top,
              transform: `rotate(${cube.rotation}deg)`,
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {/* Cube face shadows */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                transform: 'translateZ(2px)',
              }}
            />
          </div>
        ))}

        <style jsx>{`
          @keyframes float-0 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(200px, 200px) rotate(180deg) scale(1.1); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-1 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(-200px, 100px) rotate(180deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-2 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(100px, -200px) rotate(180deg) scale(1.1); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(-150px, -150px) rotate(180deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-4 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(150px, -100px) rotate(180deg) scale(1.1); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-5 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(-100px, 150px) rotate(180deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-6 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(180px, -180px) rotate(180deg) scale(1.1); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
          @keyframes float-7 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 50% { transform: translate(-180px, 120px) rotate(180deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(360deg) scale(1); } }
        `}</style>
      </div>
    </div>
  );
};

export default Login; 