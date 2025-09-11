-- Criar trigger para criar profile automaticamente quando usuário confirma email
-- Primeiro, criar o perfil para o usuário existente
INSERT INTO public.profiles (user_id, full_name, username, avatar_url)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name') as full_name,
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)) as username,
  NULL as avatar_url
FROM auth.users 
WHERE email = 'theoodawara@gmail.com' 
AND id NOT IN (SELECT user_id FROM public.profiles);

-- Agora criar a trigger para futuros usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar quando usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();