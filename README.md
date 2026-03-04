# urk — Newsletter Collector

> Discover, collect, and read newsletters in one place. Live at [urklist.com](https://urklist.com)

---

## The Problem

Newsletters are one of the best sources of curated knowledge — but the experience of managing them is broken:

- Subscribers are scattered across inboxes, Substack, Revue, and a dozen other platforms
- There's no single place to discover quality newsletters by topic
- Readers either miss issues or get buried in a cluttered inbox

Most newsletter apps optimize for *sending*. Nobody was solving the *reader* side.

---

## The Solution

**urk** is a full-stack web app that lets readers discover, bookmark, and follow newsletters in one unified place — like a Goodreads for newsletters.

**Live:** [urklist.com](https://urklist.com)

---

## Key Features

- 🔍 **Discover** newsletters by category and topic
- 🔖 **Bookmark** and organize newsletters you follow
- 🔐 **Auth** via Google, GitHub, and credentials (NextAuth)
- 📱 **Responsive** across mobile and desktop
- ☁️ **Image hosting** via Cloudinary CDN
- 📅 **Calendar integration** for scheduled newsletter issues

---

## Product Decisions & Tradeoffs

| Decision | Why |
|---|---|
| Next.js 13 App Router | Server components reduce client bundle size — key for SEO and cold load on discovery pages |
| Prisma + MongoDB | Flexible schema for newsletters with varied metadata structures |
| NextAuth | Reduced auth friction — social login converts 3x better than email/password for new users |
| Vercel deployment | Zero-config CI/CD enabled 19 production deployments without ops overhead |

---

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Prisma ORM
- **Auth:** NextAuth (Google, GitHub, Credentials)
- **Styling:** Tailwind CSS
- **Image CDN:** Cloudinary
- **Deployment:** Vercel (19 deployments · Production)

---

## Status

🟢 **Live in production** at [urklist.com](https://urklist.com) · Active development

---

*Built by [Vaibhav Naik](https://linkedin.com/in/vaibhavvnaik) · PM learning to ship*
