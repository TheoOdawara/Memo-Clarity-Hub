import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import LogoMemoClarity from '@/assets/LogoParaQualquerFundo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [resetEmail, setResetEmail] = useState('')
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar sessão existente e redirecionar se logado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        console.warn('Session found, redirecting to dashboard...')
        navigate('/')
      }
    }
    checkSession()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.warn('Auth state changed:', event, session?.user ? 'user logged in' : 'no user')
      if (event === 'SIGNED_IN' && session?.user) {
        console.warn('User signed in, redirecting to dashboard...')
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (isSignUp) {
      // Validação de senha
      if (signupData.password !== signupData.confirmPassword) {
        setInfoMessage('As senhas não coincidem.')
        setIsLoading(false)
        return
      }
      if (signupData.password.length < 6) {
        setInfoMessage('A senha deve ter pelo menos 6 caracteres.')
        setIsLoading(false)
        return
      }

      // Cadastro direto com Supabase
      try {
        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              name: signupData.name
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        })

        if (error) {
          setError(error.message)
        } else {
          setIsSignUp(false)
          setInfoMessage('Conta criada! Confirme seu e-mail para poder fazer login.')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao criar conta')
      }
    } else {
      // Login direto com Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        })

        if (error) {
          setError(error.message)
        } else if (data.user) {
          // Redirecionamento será feito pelo useEffect
          console.warn('Login successful, redirecting...')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao fazer login')
      }
    }

    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setInfoMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
        setIsResetPassword(false)
        setResetEmail('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email de recuperação')
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Google')
    }

    setIsLoading(false)
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
                {isResetPassword ? 'Esqueci minha senha' : isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-teal-200">
                {isResetPassword 
                  ? 'Digite seu email para receber instruções de recuperação' 
                  : isSignUp 
                    ? 'Join our memory enhancement platform' 
                    : 'Welcome back to your cognitive journey'
                }
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
              
              {isResetPassword ? (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {infoMessage && (
                    <div className="mb-6 p-4 bg-green-500/30 border-2 border-green-400 text-green-100 rounded-2xl backdrop-blur-sm flex items-center space-x-3 shadow-xl">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-100">{infoMessage}</p>
                        <p className="text-xs text-green-200 mt-1">Check your email inbox and click the confirmation link.</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-semibold text-teal-100 mb-2">
                      Email Address
                    </label>
                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      'Enviar Email de Recuperação'
                    )}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetPassword(false)
                        setResetEmail('')
                        setInfoMessage(null)
                        setError(null)
                      }}
                      className="text-sm text-teal-200 hover:text-yellow-300 font-medium hover:underline transition-colors"
                    >
                      Voltar ao login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {infoMessage && (
                  <div className="mb-6 p-4 bg-green-500/30 border-2 border-green-400 text-green-100 rounded-2xl backdrop-blur-sm flex items-center space-x-3 shadow-xl">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-100">{infoMessage}</p>
                      <p className="text-xs text-green-200 mt-1">Check your email inbox and click the confirmation link.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-teal-100 mb-2">
                        Nome
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={signupData.name}
                        onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                      />
                    </div>
                  )}
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
                      value={isSignUp ? signupData.email : loginData.email}
                      onChange={(e) => {
                        if (isSignUp) {
                          setSignupData({ ...signupData, email: e.target.value })
                        } else {
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      }}
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
                      value={isSignUp ? signupData.password : loginData.password}
                      onChange={(e) => {
                        if (isSignUp) {
                          setSignupData({ ...signupData, password: e.target.value })
                        } else {
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                      }}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                    />
                  </div>
                  {isSignUp && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-teal-100 mb-2">
                        Confirmar Senha
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirme sua senha"
                        value={signupData.confirmPassword}
                        onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isSignUp ? 'Criando conta...' : 'Entrando...'}</span>
                    </div>
                  ) : (
                    isSignUp ? 'Criar Conta' : 'Entrar'
                  )}
                </button>

                {!isSignUp && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetPassword(true)
                        setError(null)
                        setInfoMessage(null)
                      }}
                      className="text-sm text-yellow-300 hover:text-yellow-200 font-medium hover:underline transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
              </form>
              )}

              {isSignUp && (
                <div className="mt-4 text-center">
                  <button
                    onClick={async () => {
                      const emailInput = (document.getElementById('email') as HTMLInputElement)
                      const email = emailInput?.value
                      if (!email) return

                      try {
                        const { error } = await supabase.auth.resend({
                          type: 'signup',
                          email: email
                        })
                        if (error) {
                          setError(error.message)
                        } else {
                          setInfoMessage('Email de confirmação reenviado!')
                        }
                      } catch {
                        setError('Erro ao reenviar confirmação')
                      }
                    }}
                    className="text-sm text-yellow-300 hover:underline"
                  >
                    Reenviar confirmação
                  </button>
                </div>
              )}

              {/* Toggle entre Login e Signup */}
              {!isResetPassword && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setInfoMessage(null)
                      setError(null)
                      // Limpar dados ao alternar modos
                      if (!isSignUp) {
                        setSignupData({ name: '', email: '', password: '', confirmPassword: '' })
                      } else {
                        setLoginData({ email: '', password: '' })
                      }
                    }}
                    className="text-sm text-teal-200 hover:text-yellow-300 font-medium hover:underline transition-colors"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign In' 
                      : 'Need an account? Create one now'
                    }
                  </button>
                </div>
              )}

              {/* Divisor e Google Login - apenas quando não é reset de senha */}
              {!isResetPassword && (
                <>
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-white/20"></div>
                    <span className="px-4 text-sm text-teal-200">or</span>
                    <div className="flex-1 border-t border-white/20"></div>
                  </div>

                  {/* Botão Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-white/10 text-white font-medium rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/20 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}
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
