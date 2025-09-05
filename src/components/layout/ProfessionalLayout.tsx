import { ProfessionalHeader } from './ProfessionalHeader'
import { ProfessionalSidebar } from './ProfessionalSidebar'

interface ProfessionalLayoutProps {
  children: React.ReactNode
}

export function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ProfessionalSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ProfessionalHeader />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
