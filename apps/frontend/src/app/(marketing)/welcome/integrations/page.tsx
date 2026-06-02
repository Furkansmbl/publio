import { PubPageHero, PubBottomCta } from '../../_lib/shell';

export const metadata = { title: 'Entegrasyonlar — Publio' };

export default function IntegrationsPage() {
  return (
    <>
      <PubPageHero
        eyebrow="Entegrasyonlar"
        title={<>AI ve otomasyon araçların Publio'yla konuşur.</>}
        subtitle="Claude, ChatGPT, Codex, n8n, Make.com, Zapier — Public API, MCP server ve SDK ile her workflow'a entegre olur."
      />

      <section className="max-w-[1240px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[820px] mx-auto">
          {['ChatGPT', 'Claude', 'Codex', 'n8n', 'Make.com', 'Zapier', 'Public API', 'MCP Server', 'OAuth2', 'Webhooks', 'SDK', 'CLI'].map((it) => (
            <div key={it} className="px-4 py-4 rounded-2xl border border-[var(--pub-line-strong)] bg-[var(--pub-paper)] text-[14px] text-center" style={{ fontWeight: 500 }}>
              {it}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Public API', d: 'REST tabanlı, tam dokümante. OAuth2 ile yetkilendirme.' },
            { t: 'MCP Server', d: 'Model Context Protocol — Claude\'a "şunu paylaş" de, Publio yayınlasın.' },
            { t: 'SDK', d: 'TypeScript SDK ile uygulamana yayın akışı eklemek dakikalar sürer.' },
          ].map((c) => (
            <div key={c.t} className="pub-card p-7">
              <h4 className="text-[18px] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{c.t}</h4>
              <p className="text-[14px] text-[color:var(--pub-ink-dim)] leading-[1.6]" style={{ fontWeight: 400 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <PubBottomCta />
    </>
  );
}
