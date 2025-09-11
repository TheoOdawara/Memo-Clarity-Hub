import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import LogoMemoClarity from '@/assets/LogoParaQualquerFundo.png'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se há um token de reset na URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (accessToken && refreshToken) {
      // Definir a sessão usando os tokens da URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    } else {
      // Se não há tokens, redirecionar para login
      setError('Link de recuperação inválido ou expirado.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Senha alterada com sucesso! Redirecionando...')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
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
                Redefinir Senha
              </h2>
              <p className="text-teal-200">
                Digite sua nova senha
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

            {message && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 text-green-100 rounded-2xl backdrop-blur-sm flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
              
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-teal-100 mb-2">
                  Nova Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-teal-200 text-white backdrop-blur-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-teal-100 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <span>Alterando senha...</span>
                  </div>
                ) : (
                  'Alterar Senha'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-teal-200 hover:text-yellow-300 font-medium hover:underline transition-colors"
                >
                  Voltar ao login
                </button>
              </div>
            </form>
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