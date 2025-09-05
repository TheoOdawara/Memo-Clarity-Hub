import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProfessionalLayout } from '@/components/layout/ProfessionalLayout'
import LoginPage from '@/pages/LoginPage'
import ProfessionalDashboard from '@/pages/ProfessionalDashboard'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with professional layout */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute fallback={<LoginPage />}>
                <ProfessionalLayout>
                  <Routes>
                    <Route path="/" element={<ProfessionalDashboard />} />
                    <Route path="/dashboard" element={<ProfessionalDashboard />} />
                    <Route path="/checkin" element={
                      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="text-6xl mb-4">💭</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Como você está hoje?</h1>
                        <p className="text-gray-600">Esta funcionalidade está sendo desenvolvida...</p>
                      </div>
                    } />
                    <Route path="/games" element={
                      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="text-6xl mb-4">🧩</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercícios Mentais</h1>
                        <p className="text-gray-600">Jogos cognitivos estão chegando em breve...</p>
                      </div>
                    } />
                    <Route path="/progress" element={
                      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu Progresso</h1>
                        <p className="text-gray-600">Relatórios detalhados em desenvolvimento...</p>
                      </div>
                    } />
                  </Routes>
                </ProfessionalLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
