export default function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      {/* Check-in do Dia */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Check-in do Dia</h2>
              <p className="text-green-100">Tudo bem, recomeçar faz parte. Hoje é Dia 1 — bora juntos!</p>
            </div>
          </div>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Fazer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sequência */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-blue-100">Sequência</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">0</p>
            <p className="text-blue-100 text-sm">dias</p>
          </div>
        </div>

        {/* Score */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 012-2h2a2 2 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm text-purple-100">Score</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">12</p>
            <p className="text-purple-100 text-sm">Top 88%</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: 'Frequência do Dia',
              subtitle: '15 min',
              icon: '🎧',
              color: 'bg-blue-500',
              href: '/frequency'
            },
            {
              name: 'Jogo do Dia',
              subtitle: 'Memória',
              icon: '🎮',
              color: 'bg-yellow-500',
              href: '/games'
            },
            {
              name: 'Ver Ranking',
              subtitle: 'Top 100',
              icon: '🏆',
              color: 'bg-purple-500',
              href: '/ranking'
            },
            {
              name: 'Sorteios do Mês',
              subtitle: 'Participe',
              icon: '🎁',
              color: 'bg-orange-500',
              href: '/raffles'
            }
          ].map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow border border-gray-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <span className="text-xl">{action.icon}</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{action.name}</h4>
              <p className="text-xs text-gray-500">{action.subtitle}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Sorteio em Destaque */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Sorteio de Dezembro</h3>
            <p className="text-yellow-100">Participe das atividades mensais e ganhe incríveis prêmios!</p>
          </div>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
            Participar
          </button>
        </div>
      </div>

      {/* Seção lateral - Patrocinado e Membros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Pode adicionar conteúdo principal aqui */}
        </div>
        
        <div className="space-y-6">
          {/* Patrocinado */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Patrocinado</h4>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-xl">💊</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 text-sm">Suplementos Cognitivos</h5>
                <p className="text-xs text-gray-500">Melhore sua performance mental</p>
              </div>
            </div>
          </div>

          {/* Membros Ativos */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Membros Ativos</h4>
            <div className="space-y-3">
              {['Ana Silva', 'Carlos Santos', 'Maria Oliveira'].map((member) => (
                <div key={member} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
