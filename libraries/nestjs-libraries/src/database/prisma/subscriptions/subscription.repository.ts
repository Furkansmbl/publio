import { Injectable } from '@nestjs/common';
import {
  PrismaRepository,
  PrismaTransaction,
} from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { Organization } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(
    private readonly _subscription: PrismaRepository<'subscription'>,
    private readonly _organization: PrismaRepository<'organization'>,
    private readonly _user: PrismaRepository<'user'>,
    private readonly _credits: PrismaRepository<'credits'>,
    private _usedCodes: PrismaRepository<'usedCodes'>
  ) {}

  getUserAccount(userId: string) {
    return this._user.model.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        account: true,
        connectedAccount: true,
      },
    });
  }

  getCode(code: string) {
    return this._usedCodes.model.usedCodes.findFirst({
      where: {
        code,
      },
    });
  }

  updateAccount(userId: string, account: string) {
    return this._user.model.user.update({
      where: {
        id: userId,
      },
      data: {
        account,
      },
    });
  }

  getSubscriptionByOrganizationId(organizationId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
  }

  updateConnectedStatus(account: string, accountCharges: boolean) {
    return this._user.model.user.updateMany({
      where: {
        account,
      },
      data: {
        connectedAccount: accountCharges,
      },
    });
  }

  getCustomerIdByOrgId(organizationId: string) {
    return this._organization.model.organization.findFirst({
      where: {
        id: organizationId,
      },
      select: {
        paymentId: true,
      },
    });
  }

  checkSubscription(organizationId: string, subscriptionId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organizationId,
        identifier: subscriptionId,
        deletedAt: null,
      },
    });
  }

  deleteSubscriptionByCustomerId(customerId: string) {
    return this._subscription.model.subscription.deleteMany({
      where: {
        organization: {
          paymentId: customerId,
        },
      },
    });
  }

  updateCustomerId(organizationId: string, customerId: string) {
    return this._organization.model.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        paymentId: customerId,
      },
    });
  }

  async getSubscriptionByOrgId(orgId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organizationId: orgId,
      },
    });
  }

  async getSubscriptionByCustomerId(customerId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organization: {
          paymentId: customerId,
        },
      },
    });
  }

  async getOrganizationByCustomerId(customerId: string) {
    return this._organization.model.organization.findFirst({
      where: {
        paymentId: customerId,
      },
    });
  }

  async createOrUpdateSubscription(
    isTrailing: boolean,
    identifier: string,
    customerId: string,
    totalChannels: number,
    billing: 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE',
    period: 'MONTHLY' | 'YEARLY',
    cancelAt: number | null,
    code?: string,
    org?: { id: string }
  ) {
    const findOrg =
      org || (await this.getOrganizationByCustomerId(customerId))!;

    if (!findOrg) {
      return;
    }

    await this._subscription.model.subscription.upsert({
      where: {
        organizationId: findOrg.id,
        ...(!code
          ? {
              organization: {
                paymentId: customerId,
              },
            }
          : {}),
      },
      update: {
        subscriptionTier: billing,
        totalChannels,
        period,
        identifier,
        isLifetime: !!code,
        cancelAt: cancelAt ? new Date(cancelAt * 1000) : null,
        deletedAt: null,
      },
      create: {
        organizationId: findOrg.id,
        subscriptionTier: billing,
        isLifetime: !!code,
        totalChannels,
        period,
        cancelAt: cancelAt ? new Date(cancelAt * 1000) : null,
        identifier,
        deletedAt: null,
      },
    });

    await this._organization.model.organization.update({
      where: {
        id: findOrg.id,
      },
      data: {
        isTrailing,
        allowTrial: false,
      },
    });

    if (code) {
      await this._usedCodes.model.usedCodes.create({
        data: {
          code,
          orgId: findOrg.id,
        },
      });
    }
  }

  getSubscriptionByIdentifier(identifier: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        identifier,
        deletedAt: null,
      },
      include: {
        organization: true,
      },
    });
  }

  getSubscription(organizationId: string) {
    return this._subscription.model.subscription.findFirst({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
  }

  async getCreditsFrom(
    organizationId: string,
    from: dayjs.Dayjs,
    type = 'ai_images'
  ) {
    const load = await this._credits.model.credits.groupBy({
      by: ['organizationId'],
      where: {
        organizationId,
        type,
        createdAt: {
          gte: from.toDate(),
        },
      },
      _sum: {
        credits: true,
      },
    });

    return load?.[0]?._sum?.credits || 0;
  }

  /**
   * Publio credit-pricing: ilgili faturalandırma döngüsü içinde TÜKETİLEN
   * (pozitif) toplam krediyi döner. Top-up alımları (`type='topup'`) ve süresi
   * dolmuş top-up temizlikleri (`type='topup_expired'`) hariç tutulur; yalnızca
   * gerçek AI tüketimi sayılır.
   */
  async getConsumedCreditsFrom(
    organizationId: string,
    from: dayjs.Dayjs
  ): Promise<number> {
    const load = await this._credits.model.credits.aggregate({
      where: {
        organizationId,
        createdAt: { gte: from.toDate() },
        credits: { gt: 0 },
        type: { notIn: ['topup', 'topup_expired'] },
      },
      _sum: { credits: true },
    });

    return load?._sum?.credits || 0;
  }

  /**
   * Aktif (süresi dolmamış) top-up paketlerinde kalan toplam krediyi döner.
   * Plan dahil aylık kredi tükendiğinde bu bakiye kullanılır.
   */
  async getTopUpRemaining(organizationId: string): Promise<number> {
    const load = await this._credits.model.topUpPackage.aggregate({
      where: {
        organizationId,
        expiresAt: { gt: new Date() },
        remainingCredits: { gt: 0 },
      },
      _sum: { remainingCredits: true },
    });

    return load?._sum?.remainingCredits || 0;
  }

  /**
   * Sağlayıcı bazında tüketim/maliyet dökümü (audit + şeffaflık paneli).
   * Credits tablosundaki pozitif tüketim kayıtlarını gruplar.
   */
  async getUsageBreakdownFrom(organizationId: string, from: dayjs.Dayjs) {
    const grouped = await this._credits.model.credits.groupBy({
      by: ['provider'],
      where: {
        organizationId,
        createdAt: { gte: from.toDate() },
        credits: { gt: 0 },
        type: { notIn: ['topup', 'topup_expired'] },
      },
      _sum: { credits: true, costUsd: true },
      _count: { _all: true },
    });

    return grouped.map((g) => ({
      provider: g.provider || 'internal',
      credits: g._sum.credits || 0,
      costUsd: Number(g._sum.costUsd || 0),
      calls: g._count._all,
    }));
  }

  /** BYOK anahtarını (şifreli) ve sağlayıcıyı kaydeder. */
  async setByok(organizationId: string, provider: string, apiKeyEnc: string) {
    return this._subscription.model.subscription.updateMany({
      where: { organizationId, deletedAt: null },
      data: { byokProvider: provider, byokApiKeyEnc: apiKeyEnc },
    });
  }

  /** BYOK anahtarını temizler (varsayılan resale moduna döner). */
  async clearByok(organizationId: string) {
    return this._subscription.model.subscription.updateMany({
      where: { organizationId, deletedAt: null },
      data: { byokProvider: null, byokApiKeyEnc: null },
    });
  }

  /**
   * Aktif top-up paketlerinden (en erken biten önce) verilen miktar kadar
   * krediyi düşer. Geri alma (refund) için tüketilen paket/parça listesini döner.
   */
  private async _consumeTopUp(
    organizationId: string,
    amount: number
  ): Promise<{ id: string; amount: number }[]> {
    let remaining = amount;
    const consumed: { id: string; amount: number }[] = [];

    const packages = await this._credits.model.topUpPackage.findMany({
      where: {
        organizationId,
        expiresAt: { gt: new Date() },
        remainingCredits: { gt: 0 },
      },
      orderBy: { expiresAt: 'asc' },
    });

    for (const pkg of packages) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, pkg.remainingCredits);
      await this._credits.model.topUpPackage.update({
        where: { id: pkg.id },
        data: { remainingCredits: { decrement: take } },
      });
      consumed.push({ id: pkg.id, amount: take });
      remaining -= take;
    }

    return consumed;
  }

  /** Hata durumunda tüketilen top-up kredilerini paketlere geri yükler. */
  private async _restoreTopUp(entries: { id: string; amount: number }[]) {
    for (const e of entries) {
      await this._credits.model.topUpPackage
        .update({
          where: { id: e.id },
          data: { remainingCredits: { increment: e.amount } },
        })
        .catch(() => undefined);
    }
  }

  /**
   * Publio birleşik kredi tüketimi: plan dahil aylık krediden + (yetmezse)
   * top-up bakiyesinden düşer, AI çağrısını çalıştırır ve hata olursa tüm
   * düşümleri geri alır. BYOK durumunda kredi düşülmez, yalnızca audit loglanır.
   */
  async applyCreditCharge<T>(
    org: Organization,
    opts: {
      action: string;
      provider: string;
      costUsd: number;
      fromMonthly: number;
      fromTopUp: number;
      byok?: boolean;
      type?: string;
    },
    func: () => Promise<T>
  ): Promise<T> {
    const type = opts.type ?? 'ai_credits';

    // BYOK: kredi düşülmez, yalnızca çağrı + log.
    if (opts.byok) {
      const startedAt = Date.now();
      try {
        const result = await func();
        await this._writeUsageLog(
          org.id,
          { credits: 0, costUsd: opts.costUsd, provider: opts.provider, action: opts.action, byok: true },
          'ok',
          Date.now() - startedAt
        ).catch(() => undefined);
        return result;
      } catch (err) {
        await this._writeUsageLog(
          org.id,
          { credits: 0, costUsd: opts.costUsd, provider: opts.provider, action: opts.action, byok: true },
          'failed',
          Date.now() - startedAt,
          (err as Error)?.message ?? 'unknown'
        ).catch(() => undefined);
        throw err;
      }
    }

    // 1) Plan dahil aylık krediden düş (pozitif tüketim kaydı).
    let monthlyRow: { id: string } | null = null;
    if (opts.fromMonthly > 0) {
      monthlyRow = await this._credits.model.credits.create({
        data: {
          organizationId: org.id,
          credits: opts.fromMonthly,
          type,
          action: opts.action,
          provider: opts.provider,
          costUsd: opts.costUsd,
        },
        select: { id: true },
      });
    }

    // 2) Top-up bakiyesinden düş (paket remainingCredits decrement).
    let topUpConsumed: { id: string; amount: number }[] = [];
    if (opts.fromTopUp > 0) {
      topUpConsumed = await this._consumeTopUp(org.id, opts.fromTopUp);
    }

    const startedAt = Date.now();
    try {
      const result = await func();
      await this._writeUsageLog(
        org.id,
        {
          credits: opts.fromMonthly + opts.fromTopUp,
          costUsd: opts.costUsd,
          provider: opts.provider,
          action: opts.action,
          byok: false,
        },
        'ok',
        Date.now() - startedAt
      ).catch(() => undefined);
      return result;
    } catch (err) {
      // Refund — her iki kaynağı da geri al.
      if (monthlyRow) {
        await this._credits.model.credits
          .delete({ where: { id: monthlyRow.id } })
          .catch(() => undefined);
      }
      if (topUpConsumed.length) {
        await this._restoreTopUp(topUpConsumed);
      }
      await this._writeUsageLog(
        org.id,
        {
          credits: opts.fromMonthly + opts.fromTopUp,
          costUsd: opts.costUsd,
          provider: opts.provider,
          action: opts.action,
          byok: false,
        },
        'failed',
        Date.now() - startedAt,
        (err as Error)?.message ?? 'unknown'
      ).catch(() => undefined);
      throw err;
    }
  }

  /**
   * Eski imza (geriye d\u00f6n\u00fck uyumlu): tek bir kredi d\u00fc\u015fer, costUsd
   * kayd\u0131 olmaz. Yeni \u00e7a\u011fr\u0131lar i\u00e7in {@link useCreditWithCost} tercih edilmelidir.
   */
  async useCredit<T>(
    org: Organization,
    type = 'ai_images',
    func: () => Promise<T>
  ) {
    return this.useCreditWithCost(org, { type, credits: 1 }, func);
  }

  /**
   * Publio credit-pricing modeli i\u00e7in geni\u015fletilmi\u015f varyant.
   *
   * - `credits`   : kullan\u0131c\u0131dan d\u00fc\u015fen tutar (\u00f6n-default 1)
   * - `costUsd`   : sa\u011flay\u0131c\u0131ya tahmini maliyet (margin raporu)
   * - `provider`  : sa\u011flay\u0131c\u0131 id\n   * - `action`    : credit-catalog id \u2014 \u00f6r. \"video.heyGen.60s\"\n   * - `byok`     : m\u00fc\u015fteri kendi anahtar\u0131yla \u00e7a\u011f\u0131rd\u0131ysa true; bu durumda\n   *               kredi d\u00fc\u015f\u00fc\u015f\u00fc s\u0131f\u0131r olur (`credits=0`) ama AIUsageLog at\u0131l\u0131r.\n   */
  async useCreditWithCost<T>(
    org: Organization,
    opts: {
      type?: string;
      credits: number;
      costUsd?: number;
      provider?: string;
      action?: string;
      byok?: boolean;
      topUpId?: string;
    },
    func: () => Promise<T>
  ): Promise<T> {
    const credits = opts.byok ? 0 : opts.credits;
    const data = credits > 0
      ? await this._credits.model.credits.create({
          data: {
            organizationId: org.id,
            credits,
            type: opts.type ?? 'ai_images',
            // Schema additions \u2014 nullable kabul ediyor.
            ...(opts.action ? { action: opts.action } : {}),
            ...(opts.provider ? { provider: opts.provider } : {}),
            ...(opts.costUsd != null ? { costUsd: opts.costUsd } : {}),
            ...(opts.topUpId ? { topUpId: opts.topUpId } : {}),
          },
        })
      : null;

    const startedAt = Date.now();
    try {
      const result = await func();
      // Ba\u015far\u0131l\u0131 \u00e7a\u011fr\u0131y\u0131 AIUsageLog'a yaz (best-effort).
      await this._writeUsageLog(org.id, opts, 'ok', Date.now() - startedAt).catch(
        () => undefined
      );
      return result;
    } catch (err) {
      if (data) {
        await this._credits.model.credits.delete({ where: { id: data.id } });
      }
      await this._writeUsageLog(
        org.id,
        opts,
        'failed',
        Date.now() - startedAt,
        (err as Error)?.message ?? 'unknown'
      ).catch(() => undefined);
      throw err;
    }
  }

  private async _writeUsageLog(
    organizationId: string,
    opts: {
      credits: number;
      costUsd?: number;
      provider?: string;
      action?: string;
      byok?: boolean;
    },
    status: 'ok' | 'failed' | 'refunded',
    durationMs: number,
    errorMessage?: string
  ) {
    // Prisma client'ta `aIUsageLog` model olarak otomatik t\u00fcretilir.
    // \u015eema migrasyonu \u00e7al\u0131\u015fmadan \u00f6nce model bulunmayabilir; o nedenle
    // dynamic erisim + try/catch ile g\u00fcvenli h\u00e2le getiriyoruz.
    const anyClient = this._credits.model as unknown as {
      $parent?: unknown;
    };
    const root = (anyClient as any)?.$parent ?? (this as any)._credits?.client;
    const log = root?.aIUsageLog ?? root?.aiUsageLog;
    if (!log?.create) return;
    try {
      await log.create({
        data: {
          organizationId,
          action: opts.action ?? 'unknown',
          provider: opts.provider ?? 'internal',
          credits: opts.credits,
          costUsd: opts.costUsd ?? 0,
          durationMs,
          status,
          byok: !!opts.byok,
          errorMessage: errorMessage?.slice(0, 1000),
        },
      });
    } catch {
      /* migration uygulanmad\u0131ysa sessiz ge\u00e7 */
    }
  }

  setCustomerId(orgId: string, customerId: string) {
    return this._organization.model.organization.update({
      where: {
        id: orgId,
      },
      data: {
        paymentId: customerId,
      },
    });
  }
}
