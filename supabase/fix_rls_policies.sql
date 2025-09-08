-- Verificar e corrigir políticas RLS para profiles
-- Execute no SQL Editor do Supabase

-- Verificar políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Se não houver política de INSERT, criar uma
-- (Isso permite que usuários autenticados criem seu próprio profile)
DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
CREATE POLICY "Insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid()::uuid = user_id);

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles' AND schemaname = 'public';
