-- Execute este SQL no Supabase SQL Editor para auto-confirmar usuários
-- Solução para desenvolvimento quando não há acesso ao painel de configuração

-- 1. Função para auto-confirmar usuários
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirma o email do usuário recém-criado
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger para executar auto-confirmação
DROP TRIGGER IF EXISTS auto_confirm_trigger ON auth.users;
CREATE TRIGGER auto_confirm_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- 3. Confirmar usuários existentes (se houver)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
