# 🔧 QUICK FIX: Execute esta migration SQL

## ⚠️ Situação Detectada:
- ✅ Supabase conectado
- ✅ Usuários existem (3 registros em profiles)
- ❌ Tabelas `checkins` e `tests` não existem

## 🚀 Solução: Copie e execute este SQL

**1. Acesse:** [seu projeto Supabase](https://app.supabase.io)  
**2. Vá em:** SQL Editor  
**3. Cole e execute:**

```sql
-- Adicionar colunas faltantes em profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

-- Criar tabela checkins
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  checked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  streak_day INTEGER DEFAULT 1,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela tests
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  phase_scores JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar indexes para performance
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_checked_at ON checkins(checked_at);
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_completed_at ON tests(completed_at);

-- Habilitar Row Level Security
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para checkins
CREATE POLICY "Users can view own checkins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de segurança para tests
CREATE POLICY "Users can view own tests" ON tests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tests" ON tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-confirmar usuários (opcional, para resolver email)
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_confirm_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- Confirmar usuários pendentes
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

## ✅ Depois de executar:
1. Clique "Test System" novamente
2. Deve mostrar: ✅ Found X records em todas as tabelas
3. Teste login com sua conta (agora deve funcionar sem confirmação)
4. Teste o "Combined Test" (4 fases)

## 🎯 Resultado Esperado:
- ✅ Checkins table: Found 0 records
- ✅ Tests table: Found 0 records  
- ✅ Email confirmation resolvido
- ✅ Pronto para produção
