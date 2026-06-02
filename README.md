<h1 align="center">Publio</h1>

<p align="center">
  <strong>AI destekli, çok kanallı sosyal medya orkestrasyon platformu.</strong><br/>
  Tek panelden 28+ kanala planla, yayınla, ölç ve büyüt.
</p>

<p align="center">
  <a href="https://opensource.org/license/agpl-v3"><img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg" alt="License"></a>
  <a href="https://github.com/Furkansmbl/publio"><img src="https://img.shields.io/badge/source-github-black.svg" alt="Source"></a>
  <img src="https://img.shields.io/badge/node-%3E=20.17.0-43853d.svg" alt="Node">
  <img src="https://img.shields.io/badge/pnpm-%3E=8-orange.svg" alt="pnpm">
</p>

---

## ⚡ Publio nedir?

Publio; içerik üretimi, planlama, yayınlama, analiz ve ekip iş birliğini tek
bir açık kaynaklı platformda toplayan kurumsal seviye bir **sosyal medya
yönetim ve AI ajan altyapısıdır**. Kendi sunucunuzda barındırabilir veya
yönetilen Publio Cloud servisini kullanabilirsiniz.

Publio, [Postiz](https://github.com/gitroomhq/postiz-app) açık kaynak
projesinin AGPL-3.0 lisansı altında **Verihane** tarafından sürdürülen ve
geliştirilen bir türevidir. Detaylar için [`NOTICE`](NOTICE) dosyasına
bakınız.

## ✨ Öne çıkan özellikler

- **28+ kanal:** Instagram, YouTube, LinkedIn, TikTok, Facebook, X, Threads,
  Reddit, Pinterest, Discord, Slack, Telegram, Mastodon, Bluesky, Dev.to,
  Medium, Hashnode, WordPress, Dribbble, Lemmy, VK, Nostr, Google My Business
  ve daha fazlası.
- **AI ajan motoru:** Caption / başlık üretimi, görsel oluşturma, video
  scripting, HeyGen / ElevenLabs / Runway / OpenAI / Anthropic entegrasyonu.
- **Akıllı takvim:** Drag-and-drop, evergreen rotasyonu, optimum saat önerisi.
- **Ekip iş birliği:** Onay akışları, roller, yorumlar, marka tonu paylaşımı.
- **Analitik:** Kanal bazlı performans, içerik karşılaştırma, trend tespiti.
- **Public API + N8N + Make.com + Zapier** entegrasyonları, NodeJS SDK.
- **Self-host & Cloud:** Aynı kod tabanı, aynı özellikler.

## 🧱 Mimari

| Katman          | Teknoloji                                    |
| --------------- | -------------------------------------------- |
| Monorepo        | pnpm workspaces + NX                         |
| Frontend        | Next.js 14 (App Router) + React + Tailwind 3 |
| Backend         | NestJS (REST + Public API)                   |
| Orkestrasyon    | Temporal (NestJS workflows & activities)     |
| Veritabanı      | PostgreSQL + Prisma ORM                      |
| Kuyruk / Cache  | Redis (BullMQ)                               |
| E-posta         | Resend                                       |
| Gözlemlenebilirlik | Sentry                                    |

## 🚀 Hızlı başlangıç (geliştirici)

Gereksinimler: **Node 20.17+**, **pnpm 8+**, **Docker**, **PostgreSQL**, **Redis**.

```bash
git clone https://github.com/Furkansmbl/publio.git
cd publio
cp .env.example .env             # değerleri doldurun
pnpm install
docker compose -f docker-compose.dev.yaml up -d
pnpm run prisma-db-push
pnpm run dev
```

Servisler:

- Frontend: <http://localhost:4200>
- Backend API: <http://localhost:3001>
- Orchestrator: <http://localhost:3002>

## 📦 Komutlar

| Komut                       | Açıklama                            |
| --------------------------- | ----------------------------------- |
| `pnpm run dev`              | Tüm uygulamaları geliştirme modunda |
| `pnpm run build`            | Tümünü üretim için derle            |
| `pnpm test`                 | Jest ile test (kapsam dahil)        |
| `pnpm run prisma-generate`  | Prisma client üret                  |
| `pnpm run prisma-db-push`   | Şemayı veritabanına uygula          |

## 🗂️ Klasör yapısı

```
apps/
  backend/        NestJS API (controllers + services)
  orchestrator/   Temporal workflows / activities
  frontend/       Next.js arayüzü
  commands/       CLI / cron komutları
  extension/      Tarayıcı uzantısı (Vite + React)
  sdk/            Resmî NodeJS SDK
libraries/        Paylaşılan modüller (helpers, NestJS, React)
```

## 💼 Ticari kullanım & Cloud

Publio kaynak kodu **AGPL-3.0** lisansı ile dağıtılır. Bu, ağ üzerinden
hizmet sunduğunuzda kaynak kodu paylaşma yükümlülüğü doğurur. Kendi
ürününüzde gizli tutmak istiyorsanız ya da kurumsal SLA / destek almak
istiyorsanız <info@verihane.net> üzerinden ticari lisans ve Publio Cloud
hakkında bilgi alabilirsiniz.

Fiyatlandırma stratejisi ve token-bazlı maliyet modeli için bkz.
[`docs/pricing-strategy.md`](docs/pricing-strategy.md).

## 🤝 Katkı

PR'lar memnuniyetle karşılanır. Conventional Commits (`feat:`, `fix:`,
`chore:` …) kullanın. Önemli bir değişiklik için önce issue açın.

## 🛡️ Güvenlik

Güvenlik açığı bildirimleri için <security@verihane.net> adresine yazın.
Açığı kamuoyuna duyurmadan önce 90 günlük koordineli açıklama süresi tanıyın.

## 📜 Lisans

GNU Affero General Public License v3.0 — bkz. [`LICENSE`](LICENSE) ve
[`NOTICE`](NOTICE).

```
Publio — Copyright (C) 2026 Verihane
Postiz upstream — Copyright (C) Gitroom and Postiz contributors

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, version 3.
```

---

<p align="center">
  <sub>İşletilen ve sürdürülen: <strong>Verihane</strong> · Çankaya / Ankara · <a href="mailto:info@verihane.net">info@verihane.net</a></sub>
</p>
