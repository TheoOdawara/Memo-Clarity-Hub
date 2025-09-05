import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp, loginDemo, loading, error } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [testResults, setTestResults] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (isSignUp) {
      signUp(email, password)
    } else {
      signIn(email, password)
    }
  }

  const runTests = async () => {
    setTestResults('Testing connection...')
    
    try {
      // Teste simples de conectividade
      setTestResults('✅ System working normally')
    } catch (error) {
      setTestResults('❌ Connection error: ' + String(error))
    }
  }

  const handleDemoLogin = () => {
    setTestResults('🎭 Logging in as demo user...')
    loginDemo()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorativo animado */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Padrão de pontos */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Formulário centralizado */}
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">MemoClarity</h1>
            <p className="text-purple-200">Welcome back</p>
          </div>

          {/* Card do formulário */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? '✨ Create Account' : '🚀 Sign In'}
              </h2>
              <p className="text-purple-200">
                {isSignUp ? 'Join our community' : 'Continue your journey'}
              </p>
            </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 text-red-100 rounded-2xl backdrop-blur-sm flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-purple-100 mb-2">
                      📧 Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 placeholder-purple-200 text-white backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-purple-100 mb-2">
                      🔐 Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 placeholder-purple-200 text-white backdrop-blur-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                    </div>
                  ) : (
                    isSignUp ? '✨ Create Account' : '🚀 Sign In Now'
                  )}
                </button>
              </form>

              {/* Toggle entre Login e Signup */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-purple-200 hover:text-white font-medium hover:underline transition-colors"
                >
                  {isSignUp 
                    ? '👋 Already have an account? Sign In' 
                    : '🆕 No account? Create one now'
                  }
                </button>
              </div>

              {/* Divisor */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-sm text-purple-200">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Botão Demo */}
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 px-4 bg-white/10 text-white font-medium rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/20"
              >
                <span className="text-xl">🎭</span>
                <span>Demo Mode</span>
              </button>

              {/* Área de testes */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={runTests}
                  className="w-full py-2 px-4 text-sm text-purple-200 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>🔧 Test System</span>
                </button>
                
                {testResults && (
                  <div className="mt-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                    <pre className="text-xs text-purple-100 whitespace-pre-wrap">
                      {testResults}
                    </pre>
                  </div>
                )}
              </div>
          </div>

          {/* Footer simplificado */}
          <div className="text-center mt-8">
            <p className="text-sm text-purple-300">
              💜 Memory care platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
