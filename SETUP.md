# ContractGen - Setup Guide

## Quick Start (Demo Mode)

```bash
npm install
npm run dev
```
Open http://localhost:3000 - работает без внешних сервисов!

---

## Production Setup

### 1. Supabase (База данных + Auth)

1. Создай проект на [supabase.com](https://supabase.com)
2. Скопируй ключи из Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Примени миграцию:
   ```sql
   -- Скопируй содержимое supabase/migrations/001_initial_schema.sql
   -- и выполни в Supabase SQL Editor
   ```

4. Настрой OAuth провайдеры в Authentication → Providers:
   - **Google**: Client ID + Secret из Google Cloud Console
   - **GitHub**: Client ID + Secret из GitHub Developer Settings

### 2. Stripe (Платежи)

1. Создай аккаунт на [stripe.com](https://stripe.com)
2. Скопируй ключи из Developers → API keys:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)

3. Создай Webhook в Developers → Webhooks:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.paid`
   - Скопируй `STRIPE_WEBHOOK_SECRET`

### 3. Resend (Email)

1. Создай аккаунт на [resend.com](https://resend.com)
2. Скопируй API Key:
   - `RESEND_API_KEY` (re_...)

3. Верифицируй домен для продакшена

### 4. OpenAI (AI генерация контрактов)

1. Создай API key на [platform.openai.com](https://platform.openai.com)
2. Скопируй:
   - `OPENAI_API_KEY` (sk-...)

---

## Environment Variables

Создай `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Deploy

### Vercel (Рекомендуется)

```bash
npm i -g vercel
vercel
```

Добавь environment variables в Vercel Dashboard.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Features Checklist

- [x] 37 routes (27 pages + 10 API)
- [x] Auth (Email + Google + GitHub)
- [x] Middleware protection
- [x] Contract generator (AI)
- [x] E-signatures
- [x] Invoicing
- [x] Deal pipeline (Kanban)
- [x] Brand CRM
- [x] Rate calculator
- [x] Media kit builder
- [x] Time tracking
- [x] Expense tracking
- [x] Tax reports
- [x] Calendar sync
- [x] Proposals
- [x] Workflows automation
- [x] PDF export
- [x] Email templates

---

## Support

Email: support@contractgen.io
