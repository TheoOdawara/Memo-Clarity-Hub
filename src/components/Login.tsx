import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { Brain } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { loginWithEmail } = useAppContext();

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, digite seu e-mail');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Por favor, digite um e-mail válido');
      return;
    }

    setError('');
    loginWithEmail(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-login-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-login-button rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-login-background" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-login-text mb-2">
            Bem-vindo ao MemoClarity
          </h1>
          <p className="text-login-text/80">
            Digite seu e-mail para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-login-text">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-login-text/10 border-login-text/20 text-login-text placeholder:text-login-text/60 focus:border-login-button focus:ring-login-button"
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-login-button hover:bg-login-button/90 text-login-background font-semibold py-3"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;