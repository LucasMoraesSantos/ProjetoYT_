# Editorial Automation App

Aplicação web full-stack para automação editorial de canais dark no YouTube.

## Stack
- Frontend: React + Vite + TypeScript + TailwindCSS + React Router.
- UI libs: lucide-react, recharts, react-hook-form, zod, sonner.
- Auth e dados: Firebase Authentication, Cloud Firestore e Cloud Storage.
- Backend: Cloud Functions for Firebase v2 (TypeScript + Firebase Admin SDK).
- Hospedagem frontend: Netlify.

## Estrutura
```txt
editorial-automation-app/
├── src/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── types/
├── functions/
│   ├── src/
│   │   ├── lib/
│   │   ├── generateScript.ts
│   │   ├── reviewScript.ts
│   │   ├── scanYoutubeTrends.ts
│   │   ├── analyzePerformanceInsights.ts
│   │   └── scheduledJobs.ts
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── firebase.json
├── netlify.toml
├── .env.example
└── README.md
```

## 1) Instalar dependências
```bash
npm install
cd functions && npm install && cd ..
```

## 2) Configurar Firebase
1. Crie um projeto no Firebase Console.
2. Ative Authentication (Google provider).
3. Ative Firestore (modo production).
4. Ative Storage.
5. Instale Firebase CLI e autentique:
```bash
npm i -g firebase-tools
firebase login
firebase use --add
```

## 3) Configurar Firebase Auth
- Provedor recomendado: Google.
- Em Authentication > Sign-in method > Google > Enable.
- Adicione domínio de produção e de dev autorizados.

## 4) Configurar Firestore
- Publique regras e índices:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 5) Configurar Storage
- Publique regras:
```bash
firebase deploy --only storage
```

## 6) Configurar Functions
1. Entre na pasta functions e instale dependências.
2. Build local:
```bash
cd functions
npm run build
cd ..
```

## 7) Configurar secrets
```bash
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set YOUTUBE_API_KEY
firebase functions:secrets:set AI_MODEL
```

Secrets obrigatórios:
- OPENAI_API_KEY
- AI_MODEL
- YOUTUBE_API_KEY

Secrets futuros:
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET
- YOUTUBE_REDIRECT_URI
- FRONTEND_URL
- INTERNAL_CRON_SECRET

## 8) Rodar localmente
```bash
npm install
npm run dev
npm run build
```

## 9) Deploy
```bash
firebase deploy --only functions
firebase deploy --only firestore:rules,storage
```

## 10) Configurar Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect já configurado em `netlify.toml`.

## 11) Variáveis VITE_* no Netlify
Configure no painel do Netlify (Site settings > Environment variables):
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID (opcional, para Analytics)
- VITE_FUNCTIONS_BASE_URL

## 12) Como usar o sistema
1. Acesse `/login` e autentique com Google.
2. Cadastre canais em `/channels`.
3. Escaneie tendências em `/trends` (usa YouTube Data API via function privada).
4. Gere e revise roteiros em `/scripts` (usa OpenAI via function privada).
5. Organize pipeline em `/productions` e faça upload de vídeo/thumbnail no Storage.
6. Prepare metadata em `/publishing`.
7. Use `/analytics` e `/settings` como base para evolução com OAuth YouTube.

## Segurança
- Nenhuma API key no frontend.
- Nenhuma API key hardcoded em código.
- Funções privadas validam `Authorization: Bearer <firebase_id_token>`.
- Chaves sensíveis apenas por Firebase Functions Secrets.


## Segurança operacional (importante)
- **Nunca** cole chaves reais em issues, PRs, prompts ou código-fonte.
- Se uma chave for exposta, gere rotação imediata no provedor (OpenAI/Google Cloud) e substitua o secret no Firebase.
- Mantenha apenas placeholders no `.env.example`.

## Collections modeladas
- users
- channels
- editorialProfiles
- competitorVideos
- trendOpportunities
- scripts
- productions
- youtubeTokens (bloqueada no frontend)
- youtubeOAuthStates (bloqueada no frontend)
- videoPerformance (write backend only)
- performanceInsights (write backend only)
- appLogs (write backend only)
