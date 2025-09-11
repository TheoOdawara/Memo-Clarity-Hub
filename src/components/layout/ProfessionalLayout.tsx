import { ProfessionalHeader } from './ProfessionalHeader'

interface ProfessionalLayoutProps {
  children: React.ReactNode
}

export function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <ProfessionalHeader />
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
