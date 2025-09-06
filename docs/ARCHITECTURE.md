
# 🏗️ Architecture - MemoClarity MVP

## 📐 Architecture Overview

MemoClarity MVP was designed with a modern, scalable, and easy-to-maintain architecture, using React + TypeScript on the frontend and Supabase as backend-as-a-service.

## 🎯 Architectural Principles

### 1. **Separation of Concerns**
- Components focused on UI
- Custom hooks for business logic
- Services for API integration
- Utils for helper functions

### 2. **Scalability**
- Modular architecture by features
- Reusable components
- State managed by specific contexts
- Lazy loading of routes and components

### 3. **Maintainability**
- TypeScript for type safety
- Consistent folder structure
- Inline documentation
- Automated tests

### 4. **Performance**
- Automatic code splitting
- Image optimization
- Smart caching
- PWA capabilities

---

## 🏢 High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │  External APIs  │
│   (React TS)    │◄──►│   (Backend)      │◄──►│   (Optional)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
     │                       │                       │
     │                       │                       │
  ┌────▼────┐            ┌─────▼──────┐         ┌──────▼─────┐
  │ Vercel  │            │ PostgreSQL │         │ Analytics  │
  │ Deploy  │            │ Database   │         │ Services   │
  └─────────┘            └────────────┘         └────────────┘
```

## 📁 Directory Structure

```
src/
├── components/           # React components
│   ├── ui/              # Base components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── features/        # Feature components
│       ├── auth/
│       ├── dashboard/
│       ├── games/
│       └── profile/
├── pages/               # Main pages
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── index.tsx
│   ├── Dashboard/
│   │   ├── Home.tsx
│   │   ├── Analytics.tsx
│   │   └── index.tsx
│   └── Games/
│       ├── SequenceGame.tsx
│       ├── MemoryGame.tsx
│       └── index.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   ├── useGame.ts
│   └── useCheckIn.ts
├── services/            # API integrations
│   ├── supabase.ts
│   ├── auth.ts
│   ├── games.ts
│   └── analytics.ts
├── context/             # Context providers
│   ├── AuthContext.tsx
│   ├── GameContext.tsx
│   └── AppContext.tsx
├── utils/               # Utility functions
│   ├── helpers.ts
│   ├── constants.ts
│   ├── validators.ts
│   └── formatters.ts
├── types/               # TypeScript definitions
│   ├── auth.ts
│   ├── games.ts
│   ├── user.ts
│   └── api.ts
├── styles/              # Global styles
│   ├── globals.css
│   ├── components.css
│   └── tailwind.css
└── assets/              # Static assets
  ├── images/
  ├── icons/
  └── sounds/
```

### 🎨 **Frontend (React + TypeScript)**

#### **Gerenciamento de Estado**
```typescript
// Context API para estado global
const AuthContext = createContext<AuthContextType>();
const GameContext = createContext<GameContextType>();
const AppContext = createContext<AppContextType>();

// useState/useReducer para estado local
const [user, setUser] = useState<User | null>(null);
const [gameState, dispatch] = useReducer(gameReducer, initialState);
```

#### **Roteamento**
```typescript
// React Router v6 com rotas protegidas
<Routes>
  <Route path="/auth/*" element={<AuthPages />} />
  <Route path="/*" element={
    <ProtectedRoute>
      <AppRoutes />
    </ProtectedRoute>
  } />
</Routes>
```

#### **Hooks Customizados**
```typescript
// useAuth - Gerenciamento de autenticação
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// useGame - Lógica de jogos
const useGame = (gameType: GameType) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  // ... lógica do jogo
};
```

### 🗄️ **Backend (Supabase)**

#### **Esquema de Banco de Dados**
```sql
-- Tabela de usuários (extende auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de check-ins diários
CREATE TABLE public.daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  date DATE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de resultados de jogos
CREATE TABLE public.game_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL,
  duration INTEGER, -- em segundos
  correct_answers INTEGER,
  total_questions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges/conquistas
CREATE TABLE public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);
```

#### **Row Level Security (RLS)**
```sql
-- Política para profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Política para check-ins
CREATE POLICY "Users can view own check-ins" 
ON public.daily_checkins FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins" 
ON public.daily_checkins FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### 🔐 **Autenticação**

#### **Fluxo de Autenticação**
```typescript
// services/auth.ts
export const authService = {
  async signUp(email: string, password: string, userData: UserData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  }
};
```

### 🎮 **Sistema de Jogos**

#### **Arquitetura de Jogos**
```typescript
// types/games.ts
interface GameConfig {
  name: string;
  description: string;
  minLevel: number;
  maxLevel: number;
  timeLimit?: number;
  scoring: ScoringConfig;
}

interface GameResult {
  score: number;
  level: number;
  duration: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
}

// hooks/useGame.ts
const useGame = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  
  const startGame = () => setGameState('playing');
  const endGame = async (result: GameResult) => {
    setGameState('finished');
    await saveGameResult(result);
  };
  
  return { gameState, startGame, endGame, score, currentLevel };
};
```

---

## 🔄 Fluxos de Dados

### **Fluxo de Autenticação**
```
1. Usuário insere credenciais
2. Frontend valida dados localmente
3. Envia requisição para Supabase Auth
4. Supabase retorna JWT token
5. Token armazenado no localStorage
6. Context atualizado com dados do usuário
7. Redirecionamento para dashboard
```

### **Fluxo de Check-in Diário**
```
1. Usuário acessa página de check-in
2. Formulário preenchido e validado
3. Dados enviados para Supabase
4. Atualização do streak no banco
5. Context de usuário atualizado
6. Feedback visual de sucesso
7. Redirecionamento para dashboard
```

### **Fluxo de Jogos**
```
1. Usuário seleciona jogo
2. Game component inicializado
3. Dados do jogo carregados do contexto
4. Jogo executado com estado local
5. Resultado calculado e validado
6. Dados salvos no Supabase
7. Estatísticas atualizadas
8. Feedback de progresso exibido
```

---

## 🔒 Segurança

### **Frontend Security**
- Validação de inputs com TypeScript
- Sanitização de dados de usuário
- Proteção contra XSS
- HTTPS obrigatório
- Timeout de sessão

### **Backend Security (Supabase)**
- Row Level Security (RLS)
- JWT token validation
- Rate limiting automático
- Backup automático de dados
- Monitoramento de acessos

---

## 📊 Performance

### **Otimizações Frontend**
```typescript
// Lazy loading de rotas
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Games = lazy(() => import('../pages/Games'));

// Code splitting por feature
const GameFeature = lazy(() => 
  import('../components/features/games/GameFeature')
);

// Memoização de componentes caros
const ExpensiveChart = memo(({ data }) => {
  return <Chart data={data} />;
});

// Custom hooks com debounce
const useSearch = (query: string, delay: number = 300) => {
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, delay);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchData(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);
  
  return results;
};
```

### **Otimizações Backend**
- Índices otimizados no PostgreSQL
- Cache de queries frequentes
- Paginação de resultados
- Compressão de responses
- CDN para assets estáticos

---

## 🧪 Testes

### **Estratégia de Testes**
```typescript
// Testes unitários (Jest + RTL)
describe('AuthService', () => {
  test('should login user with valid credentials', async () => {
    const result = await authService.signIn('test@test.com', 'password');
    expect(result.data.user).toBeDefined();
  });
});

// Testes de componentes
describe('Dashboard', () => {
  test('should display user stats', () => {
    render(<Dashboard />, { wrapper: TestWrapper });
    expect(screen.getByText('Streak: 5 dias')).toBeInTheDocument();
  });
});

// Testes de integração (Cypress)
describe('User Journey', () => {
  it('should complete daily check-in flow', () => {
    cy.login('user@test.com', 'password');
    cy.visit('/checkin');
    cy.fillCheckInForm();
    cy.get('[data-testid="submit-checkin"]').click();
    cy.contains('Check-in realizado com sucesso!');
  });
});
```

---

## 🚀 Deploy e DevOps

### **Pipeline CI/CD**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### **Monitoramento**
- Sentry para tracking de erros
- Vercel Analytics para performance
- Supabase Dashboard para métricas de DB
- Custom analytics para métricas de negócio

---

**Última Atualização:** 4 de Setembro, 2025  
**Versão da Arquitetura:** 1.0  
**Status:** 📋 Documentado e Aprovado
