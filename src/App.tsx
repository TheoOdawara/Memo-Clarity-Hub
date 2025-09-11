import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ProfessionalLayout } from '@/components/layout/ProfessionalLayout'
import LoginPage from '@/pages/LoginPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ProfessionalDashboard from '@/pages/ProfessionalDashboard'
import Games from '@/pages/Games'
import Raffles from '@/pages/Raffles'
import TestFlow from './pages/games/MediumLevelTest';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          
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
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">How are you feeling today?</h1>
                        <p className="text-gray-600">This feature is under development...</p>
                      </div>
                    } />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/test" element={<TestFlow />} />
                    <Route path="/raffles" element={<Raffles />} />
                    <Route path="/progress" element={
                      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Progress</h1>
                        <p className="text-gray-600">Detailed reports are under development...</p>
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
