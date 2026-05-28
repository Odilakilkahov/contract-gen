# InfluencerContractGen — Product Requirements Document

## Overview
AI-powered contract generator for influencer brand deals. Creates legally compliant contracts in minutes instead of hours.

## Problem Statement
- 72% of brand-influencer disputes stem from unclear contract terms
- 58% of influencers experienced payment issues in 2026
- FTC penalties up to $43,792 per violation
- EU Influencer Law 2026 requires written contracts for deals >= €1,000
- Lawyers charge $300-500 per contract

## Target Users

### Primary: Influencers/Creators
- Micro-influencers (10K-100K followers)
- Mid-tier influencers (100K-500K followers)
- Full-time creators (~2M globally)

### Secondary: Brands & Agencies
- Small brands doing influencer marketing
- Marketing agencies managing multiple creators
- Talent managers

## Core Features (MVP)

### 1. Contract Wizard
Smart questionnaire that collects:
- [ ] Platform (Instagram, TikTok, YouTube, Twitter, LinkedIn)
- [ ] Content type (Post, Story, Reel, Video, Live, UGC)
- [ ] Deliverables (quantity, format, duration)
- [ ] Compensation (flat fee, per post, revenue share, gifted)
- [ ] Payment terms (upfront %, net days, milestones)
- [ ] Timeline (draft review, posting dates, campaign duration)
- [ ] Exclusivity (competitors, duration, scope)
- [ ] Usage rights (organic only, paid ads, duration, territories)
- [ ] Revisions (how many rounds included)

### 2. AI Contract Generation
- Generates professional legal language
- FTC-compliant disclosure requirements
- EU Influencer Law 2026 compliant
- Multi-language support (EN, RU to start)

### 3. Contract Output
- PDF (branded, professional)
- DOCX (editable)
- Web link (for e-signature)

### 4. Template Library
Pre-built templates:
- [ ] Sponsored Post Agreement
- [ ] Brand Ambassador Contract
- [ ] UGC License Agreement
- [ ] Affiliate Partnership Agreement
- [ ] Product Gifting Agreement

## Key Contract Clauses

### Must-Have Clauses
1. **Scope of Work** — Detailed deliverables
2. **Compensation** — Amount, method, timing
3. **Content Approval** — Review process, revision limits
4. **Usage Rights** — Where brand can use content
5. **Exclusivity** — Competitor restrictions
6. **FTC Disclosure** — Required language
7. **Intellectual Property** — Who owns what
8. **Termination** — Kill fee, exit conditions
9. **Confidentiality** — NDA terms
10. **Dispute Resolution** — Jurisdiction, arbitration

### AI-Enhanced Suggestions
- Auto-suggest fair rates based on follower count
- Flag one-sided terms
- Recommend missing clauses
- Highlight risky provisions

## Tech Stack (Proposed)

### Frontend
- Next.js 14+ (App Router)
- Tailwind CSS + shadcn/ui
- React Hook Form (wizard)

### Backend
- Next.js API Routes or Supabase Edge Functions
- Claude API (contract generation)
- Supabase (database, auth)

### Document Generation
- React-PDF or @react-pdf/renderer
- Docx.js for Word export

### Payments
- Stripe (subscriptions, one-time)
- LemonSqueezy (alternative for simplicity)

## Monetization

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 contract/month, watermark |
| Creator | $19/mo | 10 contracts, no watermark, templates |
| Pro | $49/mo | Unlimited, e-signature, analytics |
| Agency | $149/mo | Team access, white-label, API |

## Success Metrics

### Week 1-2 (MVP)
- [ ] Landing page live
- [ ] 3 contract templates working
- [ ] 50 beta signups

### Month 1
- [ ] 200 contracts generated
- [ ] 10 paying customers
- [ ] $500 MRR

### Month 3
- [ ] 1,000 contracts generated
- [ ] 100 paying customers
- [ ] $3,000 MRR

## Competitive Advantages
1. **AI-powered** — Not just templates, intelligent generation
2. **Creator-first** — Built for influencers, not lawyers
3. **Affordable** — 10x cheaper than legal fees
4. **Fast** — 5 minutes vs 2 hours
5. **Compliant** — FTC + EU ready out of the box

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Legal liability | Disclaimer: "Not legal advice" |
| AI hallucinations | Human-reviewed base templates |
| Low conversion | Freemium model, content marketing |
| Competition | Niche focus, superior UX |

## Timeline

### Week 1 (Days 1-7)
- Day 1-2: Setup, landing page
- Day 3-4: Contract wizard UI
- Day 5-6: AI generation backend
- Day 7: PDF export

### Week 2 (Days 8-14)
- Day 8-9: Template library
- Day 10-11: User accounts, Stripe
- Day 12-13: Testing, polish
- Day 14: Launch beta

## Open Questions
1. Do we need e-signature integration for MVP?
2. Should we partner with a lawyer for template review?
3. Which languages after EN/RU? (ES, PT, DE)
