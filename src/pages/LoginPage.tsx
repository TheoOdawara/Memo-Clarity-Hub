import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@local/supabase/client'
import { migrationService } from '@/services/migration'
import { startSessionLogging, stopSessionLogging } from '@/debug/sessionLogger'
import { useRef } from 'react'
import LogoMemoClarity from '@/assets/LogoParaQualquerFundo.png'

export default function LoginPage() {
  const { signIn, signUp, loginDemo, loading, error, resendConfirmation } = useAuth()
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
    setTestResults('Testing Supabase connection...')
    
    try {
      // Teste 1: Conectividade básica
      const { data: { session } } = await supabase.auth.getSession()
      let results = '🔗 Connection: ✅ Connected\n'
      
      if (session) {
        results += `👤 Current user: ${session.user.email}\n`
      } else {
        results += '👤 Current user: Not logged in\n'
      }

      // Teste 2: Consultar tabelas
      try {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(5)
        
        results += `📋 Profiles table: ${profileError ? '❌ Error' : `✅ Found ${profiles?.length || 0} records`}\n`
      } catch {
        results += '📋 Profiles table: ❌ Table not found or no access\n'
      }

      try {
        const { data: checkins, error: checkinError } = await supabase
          .from('checkins')
          .select('*')
          .limit(5)
        
        results += `✅ Checkins table: ${checkinError ? '❌ Error' : `✅ Found ${checkins?.length || 0} records`}\n`
      } catch {
        results += '✅ Checkins table: ❌ Table not found or no access\n'
      }

      try {
        const { data: tests, error: testError } = await supabase
          .from('tests')
          .select('*')
          .limit(5)
        
        results += `🧠 Tests table: ${testError ? '❌ Error' : `✅ Found ${tests?.length || 0} records`}\n`
      } catch {
        results += '🧠 Tests table: ❌ Table not found or no access\n'
      }

      // Teste 3: Verificar se precisa executar migration
      if (results.includes('❌ Error')) {
        results += '\n⚠️ MIGRATION NEEDED:\n'
        results += '1. Open Supabase project dashboard\n'
        results += '2. Go to SQL Editor\n'
        results += '3. Copy content from supabase-migration.sql\n'
        results += '4. Run the SQL to create missing tables\n'
        results += '\nAlternatively: use "Fix Database" button below'
      } else {
        results += '\n✅ Database setup looks good!'
      }

      setTestResults(results)

      // Auto-check migration se necessário
      if (results.includes('❌ Error')) {
        const migrationCheck = await migrationService.checkMigrationNeeded()
        if (migrationCheck.needsMigration) {
          setTestResults(prev => prev + '\n\n🔧 Ready to run migration...')
        }
      }
    } catch (error) {
      setTestResults('❌ Connection error: ' + String(error))
    }
  }

  const handleDemoLogin = () => {
    setTestResults('🎭 Logging in as demo user...')
    loginDemo()
  }

  const sessionLoggingRef = useRef(false)
  const handleToggleSessionLogging = () => {
    if (sessionLoggingRef.current) {
      stopSessionLogging()
      sessionLoggingRef.current = false
    } else {
      startSessionLogging()
      sessionLoggingRef.current = true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Background decorativo com cores da marca */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Padrão de pontos */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Formulário centralizado */}
        <div className="w-full max-w-md">
          {/* Logo MemoClarity */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <img 
                src={LogoMemoClarity} 
                alt="MemoClarity Logo" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 font-sans">MemoClarity</h1>
            <p className="text-teal-200 text-lg">Enhance Your Memory, Brighten Your Mind</p>
          </div>

          {/* Card do formulário */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-teal-200">
                {isSignUp ? 'Join our memory enhancement platform' : 'Welcome back to your cognitive journey'}
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
                    <label htmlFor="email" className="block text-sm font-semibold text-teal-100 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-teal-100 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
                <div className="mt-3">
                  <button onClick={handleToggleSessionLogging} className="w-full py-2 px-2 text-sm text-white bg-white/5 hover:bg-white/10 rounded-xl">
                    Toggle Session Logging
                  </button>
                </div>
              </form>

              {isSignUp && (
                <div className="mt-4 text-center">
                  <button
                    onClick={async () => {
                      const emailInput = (document.getElementById('email') as HTMLInputElement)
                      const email = emailInput?.value
                      if (!email) return
                      await resendConfirmation(email)
                    }}
                    className="text-sm text-yellow-300 hover:underline"
                  >
                    Reenviar confirmação
                  </button>
                </div>
              )}

              {/* Toggle entre Login e Signup */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-teal-200 hover:text-yellow-300 font-medium hover:underline transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : 'Need an account? Create one now'
                  }
                </button>
              </div>

              {/* Divisor */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-sm text-teal-200">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Botão Demo */}
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 px-4 bg-yellow-500/20 text-yellow-100 font-medium rounded-2xl hover:bg-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-yellow-400/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Demo Mode</span>
              </button>

              {/* Área de testes */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={runTests}
                  className="w-full py-2 px-4 text-sm text-teal-200 bg-white/5 hover:bg-teal-500/10 rounded-xl transition-colors flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Test System</span>
                </button>
                
                {testResults && (
                  <div className="mt-3 p-3 bg-teal-500/10 rounded-xl backdrop-blur-sm border border-teal-400/20">
                    <pre className="text-xs text-teal-100 whitespace-pre-wrap">
                      {testResults}
                    </pre>
                  </div>
                )}
              </div>
          </div>

          {/* Footer simplificado */}
          <div className="text-center mt-8">
            <p className="text-sm text-teal-300">
              Enhance Your Memory, Brighten Your Mind
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
