# 🧠 MemoClarity MVP

## 📖 Sobre o Projeto

MemoClarity é uma plataforma inovadora de monitoramento de memória e saúde cognitiva, especialmente desenvolvida para pessoas de meia-idade e idosos. O MVP foca nas funcionalidades essenciais para validar o conceito e reduzir a taxa de reembolso do produto principal.

## 🎯 Objetivos do MVP

- **Reduzir 40% da taxa de reembolso** atual
- **Aumentar engajamento** dos usuários através de gamificação
- **Facilitar acompanhamento** da saúde cognitiva de forma simples
- **Criar comunidade** de apoio e motivação

## 🚀 Funcionalidades Principais

### ✅ Core Features
- 🔐 **Sistema de Autenticação** (Login/Registro)
- 📝 **Check-in Diário** para monitoramento
- 🧠 **Jogos Cognitivos** para treino de memória
- 📊 **Dashboard de Progresso** personalizado
- 🏆 **Sistema de Gamificação** (badges, streaks, pontos)

### 🔄 Features Secundárias
- 👥 **Comunidade Simulada** com interações
- 💬 **Chat de Suporte** em tempo real
- 📈 **Relatórios Avançados** de progresso
- 🎯 **Desafios Semanais** para engajamento

## 🛠️ Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth + Database + Storage)
- **Routing:** React Router v6
- **Deploy:** Vercel/Netlify
- **Analytics:** Supabase Analytics

## 📁 Estrutura do Projeto

```
MVP/
├── docs/                    # Documentação completa
│   ├── ROADMAP.md          # Roadmap detalhado por sprints
│   ├── NEXT_STEPS.md       # Próximos passos imediatos
│   └── ARCHITECTURE.md     # Arquitetura técnica
├── src/                    # Código fonte (será criado)
├── public/                 # Assets públicos (será criado)
├── .github/               # Configurações GitHub
└── README.md              # Este arquivo
```

## 🏃‍♂️ Quick Start

```bash
# 1. Clone o repositório
git clone [url-do-repo]
cd MVP

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Execute em desenvolvimento
npm run dev
```

## 📚 Documentação

- 📋 [Próximos Passos](./docs/NEXT_STEPS.md) - Tarefas imediatas
- 🗺️ [Roadmap](./docs/ROADMAP.md) - Planejamento completo
- 🏗️ [Arquitetura](./docs/ARCHITECTURE.md) - Decisões técnicas
- 🖼️ [Dashboard Patterns](./docs/DASHBOARD.md) - Visual & interaction guidelines

## 🧭 Plano rápido: Backend (3 horas)

Se você só tem ~3 horas, siga este plano enxuto e sequencial para garantir entrega segura do backend (Supabase) sem contratempos:

- Duração total estimada: 3 horas
- Objetivo: preparar schema, políticas RLS, endpoint de validação mínimo e integração frontend para salvar tentativas/testes.

Passos (hora a hora)
- 0 — Preparação (10 min)
	- Confirme acesso ao projeto Supabase (URL + anon/service keys).
	- Verifique que `MVP/supabase` contém `migrations/` ou `supabase-migration.sql` com as DDLs.

- 1 — Migrar esquema e RLS (35–45 min)
	- No Supabase SQL Editor cole e execute a migration principal (tabelas: `profiles`, `tests`, `test_attempts`, `test_actions`).
	- Ative RLS e aplique policies mínimas (SELECT público em profiles, INSERT/SELECT/UPDATE em attempts apenas para auth.uid()).
	- Teste com uma query simples (SELECT COUNT(*) FROM tests).

- 2 — Implementar endpoint de validação (45–60 min)
	- Crie uma Supabase Edge Function (TypeScript) que receba payload { attemptId, user_id, seed, actions } e execute replays determinísticos para gerar `serverScore`.
	- Inicial: validar formato e retornar OK (pode processar score localmente em uma segunda iteração).
	- Deploy e teste com curl/postman.

- 3 — Integrar frontend (35–45 min)
	- Ajuste `src/services/test.ts` para usar a Edge Function para submissão completa.
	- Implementar fallback (enqueue em localStorage) e retry (já existe no frontend — confirm/ativar).
	- Teste fluxo: iniciar teste → completar → ver tentativa em requests/console.

- 4 — Testes rápidos e monitoração (15–20 min)
	- Criar duas contas de teste; rodar fluxo end-to-end.
	- Verificar logs do Edge Function e tabelas no Supabase.
	- Remediar erros triviais e documentar passos executados.

Riscos e mitigação
- Se RLS bloquear inserções: use temporariamente uma policy aberta apenas para testes e reverta depois.
- Se o Edge Function falhar: aceitar resultados cliente e marcar como "pendente" para revalidação posterior.

Entregáveis após 3h
- Esquema aplicado no Supabase com políticas RLS base.
- Endpoint mínimo (Edge Function) para receber attempts.
- Frontend salvando tentativas com fallback local.


## 🎯 Status Atual

**Sprint 1:** 🔄 Configuração Inicial
- [ ] Configurar projeto base
- [ ] Implementar autenticação
- [ ] Criar estrutura de navegação

## 📊 Métricas de Sucesso

- 📉 **40% redução** na taxa de reembolso
- 📈 **80% dos usuários** fazem check-in 5x por semana
- ⏰ **15+ minutos** de tempo médio de sessão
- 🔄 **70% retenção** em 30 dias

## 🤝 Contribuição

Este projeto segue um roadmap estruturado em sprints. Consulte os documentos em `docs/` para entender o planejamento e próximos passos.

---

**Última atualização:** Setembro 2025  
**Versão:** MVP v1.0  
**Status:** 🚧 Em desenvolvimento
