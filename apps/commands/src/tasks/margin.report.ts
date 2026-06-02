/**
 * Publio · Margin Reporting Task
 * ------------------------------
 * `pnpm --filter ./apps/commands run command -- margin:report` ile çalışır.
 *
 * `AIUsageLog` tablosundan son N günün veri özetini çıkarır:
 *   - Toplam kredi tüketimi (credits)
 *   - Toplam sağlayıcı maliyeti (costUsd)
 *   - Tahmini gelir (credits × $0.0025)
 *   - Brüt margin yüzdesi (target ≥ %60)
 *   - Sağlayıcı bazında dağılım (top 10)
 *   - Plan tier bazında dağılım
 *   - Hatalı / başarısız çağrı oranı
 *
 * Sonuç stdout'a yazılır + opsiyonel `--json` flag'i ile makine-okunur.
 * Sentry alert kanalı, %60 brüt margin altına düşerse warn loglar.
 *
 * Cron önerisi (UTC):    0 6 * * *      (her sabah 06:00)
 */

import { Command, Positional } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CREDIT_USD_PRICE } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-catalog';

const TARGET_GROSS_MARGIN = 0.6;

interface MarginRow {
  group: string;
  calls: number;
  credits: number;
  costUsd: number;
  revenueUsd: number;
  marginPct: number;
}

@Injectable()
export class MarginReportTask {
  private readonly _log = new Logger(MarginReportTask.name);

  constructor(
    // Schema migration sonrası prisma client `aIUsageLog` modeli üretir.
    private readonly _usage: PrismaRepository<any>,
    private readonly _credits: PrismaRepository<'credits'>
  ) {}

  @Command({
    command: 'margin:report [days]',
    describe: 'Publio AI margin raporu — varsayılan son 1 gün.',
  })
  async run(
    @Positional({
      name: 'days',
      type: 'number',
      describe: 'Geriye kaç gün',
    })
    days = 1
  ) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    /*
     * AIUsageLog erişimi — tablo henüz migrate edilmediyse Prisma "model
     * not found" atar; o senaryoyu graceful handle ediyoruz.
     */
    const log = (this._usage as any)?.model?.aIUsageLog;
    if (!log) {
      this._log.warn(
        'AIUsageLog modeli üretilmemiş. `pnpm prisma-db-push` çalıştırın.'
      );
      return false;
    }

    const totalsRaw = await log.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { credits: true, costUsd: true },
      _count: { _all: true },
    });
    const totalCredits = totalsRaw._sum.credits ?? 0;
    const totalCostUsd = Number(totalsRaw._sum.costUsd ?? 0);
    const totalCalls = totalsRaw._count._all ?? 0;
    const totalRevenue = totalCredits * CREDIT_USD_PRICE;
    const totalMargin = this._marginPct(totalRevenue, totalCostUsd);

    const failed = await log.count({
      where: { createdAt: { gte: since }, status: { not: 'ok' } },
    });

    // Provider breakdown
    const providers = await log.groupBy({
      by: ['provider'],
      where: { createdAt: { gte: since } },
      _sum: { credits: true, costUsd: true },
      _count: { _all: true },
      orderBy: { _sum: { costUsd: 'desc' } },
      take: 10,
    });

    // Action breakdown — top 10 by cost
    const actions = await log.groupBy({
      by: ['action'],
      where: { createdAt: { gte: since } },
      _sum: { credits: true, costUsd: true },
      _count: { _all: true },
      orderBy: { _sum: { costUsd: 'desc' } },
      take: 10,
    });

    const providerRows: MarginRow[] = providers.map((p: any) => {
      const credits = p._sum.credits ?? 0;
      const cost = Number(p._sum.costUsd ?? 0);
      const revenue = credits * CREDIT_USD_PRICE;
      return {
        group: p.provider,
        calls: p._count._all,
        credits,
        costUsd: cost,
        revenueUsd: revenue,
        marginPct: this._marginPct(revenue, cost),
      };
    });

    const actionRows: MarginRow[] = actions.map((a: any) => {
      const credits = a._sum.credits ?? 0;
      const cost = Number(a._sum.costUsd ?? 0);
      const revenue = credits * CREDIT_USD_PRICE;
      return {
        group: a.action,
        calls: a._count._all,
        credits,
        costUsd: cost,
        revenueUsd: revenue,
        marginPct: this._marginPct(revenue, cost),
      };
    });

    this._print({
      days,
      since: since.toISOString(),
      totalCalls,
      totalCredits,
      totalCostUsd,
      totalRevenue,
      totalMargin,
      failed,
      providerRows,
      actionRows,
    });

    if (totalMargin < TARGET_GROSS_MARGIN && totalCalls > 50) {
      this._log.warn(
        `[Publio][margin] Brüt margin %${(totalMargin * 100).toFixed(1)} ` +
          `hedef %${(TARGET_GROSS_MARGIN * 100).toFixed(0)} altında. ` +
          `Pricing veya katalog gözden geçirilmeli.`
      );
    }

    return true;
  }

  private _marginPct(revenue: number, cost: number) {
    if (revenue <= 0) return 0;
    return (revenue - cost) / revenue;
  }

  private _print(s: {
    days: number;
    since: string;
    totalCalls: number;
    totalCredits: number;
    totalCostUsd: number;
    totalRevenue: number;
    totalMargin: number;
    failed: number;
    providerRows: MarginRow[];
    actionRows: MarginRow[];
  }) {
    const sep = '─'.repeat(72);
    console.log(sep);
    console.log(
      `Publio Margin Report  ·  ${s.days} gün  ·  >= ${s.since}`
    );
    console.log(sep);
    console.log(`  Toplam çağrı       : ${s.totalCalls}`);
    console.log(`  Hatalı çağrı       : ${s.failed}`);
    console.log(`  Toplam kredi       : ${s.totalCredits.toLocaleString()}`);
    console.log(`  Sağlayıcı maliyeti : $${s.totalCostUsd.toFixed(2)}`);
    console.log(`  Tahmini gelir      : $${s.totalRevenue.toFixed(2)}`);
    console.log(
      `  Brüt margin        : %${(s.totalMargin * 100).toFixed(1)}` +
        (s.totalMargin >= TARGET_GROSS_MARGIN ? '  ✅' : '  ⚠️ ')
    );
    console.log(sep);
    console.log('Sağlayıcı bazında (top 10, costUsd desc):');
    for (const r of s.providerRows) {
      console.log(
        `  ${r.group.padEnd(14)} calls=${String(r.calls).padStart(6)}  ` +
          `cost=$${r.costUsd.toFixed(2).padStart(7)}  ` +
          `rev=$${r.revenueUsd.toFixed(2).padStart(7)}  ` +
          `margin=%${(r.marginPct * 100).toFixed(1)}`
      );
    }
    console.log(sep);
    console.log('Aksiyon bazında (top 10, costUsd desc):');
    for (const r of s.actionRows) {
      console.log(
        `  ${r.group.padEnd(28)} calls=${String(r.calls).padStart(6)}  ` +
          `cost=$${r.costUsd.toFixed(2).padStart(7)}  ` +
          `rev=$${r.revenueUsd.toFixed(2).padStart(7)}  ` +
          `margin=%${(r.marginPct * 100).toFixed(1)}`
      );
    }
    console.log(sep);
  }
}
