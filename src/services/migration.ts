import { supabase } from '@local/supabase/client'

// Auto-migration: cria tabelas se não existirem
export const migrationService = {
  async runMigration() {
    try {
      console.warn('🔧 Running database migration...')
      
      // Tentar criar tabela checkins através de insert (vai falhar se não existir)
      // Se falhar, sabemos que a tabela não existe
      let needsMigration = false
      
      try {
        await supabase.from('checkins').select('id').limit(1)
      } catch {
        needsMigration = true
      }

      try {
        await supabase.from('tests').select('id').limit(1)
      } catch {
        needsMigration = true
      }

      if (needsMigration) {
        return { 
          success: false, 
          error: 'Tables missing. Please run the SQL migration manually.',
          instructions: 'Copy content from supabase-migration.sql and run in Supabase SQL Editor'
        }
      }

      console.warn('✅ All tables exist')
      return { success: true, error: null }
    } catch (error) {
      console.error('Migration check failed:', error)
      return { success: false, error: String(error) }
    }
  },

  // Verificar se migration é necessária
  async checkMigrationNeeded() {
    const checkinsExists = await supabase.from('checkins').select('id').limit(1)
    const testsExists = await supabase.from('tests').select('id').limit(1)
    
    return {
      checkins: !checkinsExists.error,
      tests: !testsExists.error,
      needsMigration: checkinsExists.error || testsExists.error
    }
  }
}
