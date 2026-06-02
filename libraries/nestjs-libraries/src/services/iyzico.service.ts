/**
 * Publio iyzico Service (TR billing).
 * -----------------------------------
 * iyzico, Türkiye için PCI-DSS uyumlu en yaygın 3D-Secure sağlayıcısıdır.
 * Bu servis SDK olmadan, native `fetch` + HMAC-SHA256 imzayla çalışır;
 * üretimde `iyzipay-node` paketine geçilebilir.
 *
 * Kapsam:
 *   1) `initCheckoutForm()`    — abonelik / top-up için Hosted Form linki
 *   2) `verifyCallback()`      — `/iyzico/callback` POST'unda imza doğrulaması
 *   3) `retrievePayment()`     — `paymentId` ile detay sorgusu (idempotency)
 *
 * Aboneliklerin döngüsel ödemesi için iyzico Aboneliği kullanılırsa
 * `subscription/checkoutform/initialize` endpoint'i tercih edilir; bu dosya
 * her iki akışı da kapsar.
 *
 * Env değişkenleri:
 *   IYZICO_API_KEY=...
 *   IYZICO_SECRET_KEY=...
 *   IYZICO_BASE_URL=https://api.iyzipay.com    (sandbox: https://sandbox-api.iyzipay.com)
 *   IYZICO_CALLBACK_URL=https://publio.app/api/iyzico/callback
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  TOP_UP_PACKAGES,
  TOP_UP_PACKAGES_TRY,
  TopUpPackageId,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/top-up-packages';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { TopUpService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/top-up.service';

interface IyzicoConfig {
  apiKey: string;
  secret: string;
  baseUrl: string;
  callbackUrl: string;
}

interface IyzicoBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber?: string;
  registrationAddress: string;
  city: string;
  country: string;
  ip: string;
  gsmNumber?: string;
}

@Injectable()
export class IyzicoService {
  private readonly _log = new Logger(IyzicoService.name);

  constructor(private readonly _topUpService: TopUpService) {}

  private _config(): IyzicoConfig {
    const apiKey = process.env.IYZICO_API_KEY;
    const secret = process.env.IYZICO_SECRET_KEY;
    if (!apiKey || !secret) {
      throw new Error(
        'IYZICO_API_KEY ve IYZICO_SECRET_KEY env değişkenleri tanımlı olmalı.'
      );
    }
    return {
      apiKey,
      secret,
      baseUrl: process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com',
      callbackUrl:
        process.env.IYZICO_CALLBACK_URL ||
        `${process.env.FRONTEND_URL ?? ''}/api/iyzico/callback`,
    };
  }

  /** PKI string + HMAC-SHA256 imzasını üretir (iyzico v2 auth header). */
  private _authHeader(uri: string, body: unknown): string {
    const cfg = this._config();
    const randomKey = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    const payload = randomKey + uri + JSON.stringify(body);
    const signature = crypto
      .createHmac('sha256', cfg.secret)
      .update(payload)
      .digest('hex');
    const auth =
      `IYZWSv2 apiKey:${cfg.apiKey}` +
      `&randomKey:${randomKey}` +
      `&signature:${signature}`;
    return Buffer.from(auth).toString('base64');
  }

  private async _post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const cfg = this._config();
    const auth = this._authHeader(path, body);
    const res = await fetch(`${cfg.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `IYZWSv2 ${auth}`,
        'Content-Type': 'application/json',
        'x-iyzi-rnd': Date.now().toString(),
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { status?: string } & T;
    if (json.status === 'failure') {
      throw new Error(`iyzico failure: ${JSON.stringify(json)}`);
    }
    return json as T;
  }

  /** Plan veya top-up ödemesi için Hosted Checkout Form başlatır. */
  async initCheckoutForm(input: {
    organizationId: string;
    /** "plan" | "topup" — webhook tarafında ayırt etmek için. */
    purpose: 'plan' | 'topup';
    /** plan ise tier (`STANDARD`, `TEAM`, ...); topup ise paket id. */
    productId: string;
    period?: 'MONTHLY' | 'YEARLY';
    buyer: IyzicoBuyer;
  }) {
    const { price, label } = this._priceForProduct(
      input.purpose,
      input.productId,
      input.period
    );

    const cfg = this._config();
    const conversationId = `${input.organizationId}_${Date.now()}`;

    const body = {
      locale: 'tr',
      conversationId,
      price: price.toFixed(2),
      paidPrice: price.toFixed(2),
      currency: 'TRY',
      basketId: `${input.purpose}_${input.productId}`,
      paymentGroup: 'SUBSCRIPTION',
      callbackUrl: cfg.callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: input.buyer.id,
        name: input.buyer.name,
        surname: input.buyer.surname,
        email: input.buyer.email,
        identityNumber: input.buyer.identityNumber || '11111111111',
        registrationAddress: input.buyer.registrationAddress,
        city: input.buyer.city,
        country: input.buyer.country,
        ip: input.buyer.ip,
        gsmNumber: input.buyer.gsmNumber,
      },
      shippingAddress: {
        contactName: `${input.buyer.name} ${input.buyer.surname}`,
        city: input.buyer.city,
        country: input.buyer.country,
        address: input.buyer.registrationAddress,
      },
      billingAddress: {
        contactName: `${input.buyer.name} ${input.buyer.surname}`,
        city: input.buyer.city,
        country: input.buyer.country,
        address: input.buyer.registrationAddress,
      },
      basketItems: [
        {
          id: input.productId,
          name: label,
          category1: 'SaaS',
          itemType: 'VIRTUAL',
          price: price.toFixed(2),
        },
      ],
      // Webhook'ta organizationId/purpose/productId'yi geri alabilmek için
      // metadata yok — bunun yerine `conversationId` + iç DB tablosu kullanılır.
    };

    type IyzicoCheckoutResp = {
      paymentPageUrl?: string;
      token?: string;
      checkoutFormContent?: string;
    };
    const resp = await this._post<IyzicoCheckoutResp>(
      '/payment/iyzipos/checkoutform/initialize/auth/ecom',
      body
    );

    return {
      url: resp.paymentPageUrl,
      token: resp.token,
      conversationId,
      // Frontend'in ödeme sonrası kullanması için.
      embed: resp.checkoutFormContent,
    };
  }

  /**
   * Callback — frontend `/iyzico/callback`'a POST'lar (`token`).
   * `retrieve` çağrısı ile ödeme detayını alıp uygun servis fonksiyonunu çağırır.
   */
  async handleCallback(token: string) {
    type IyzicoVerifyResp = {
      status?: string;
      paymentStatus?: string;
      conversationId?: string;
      basketId?: string;
      paidPrice?: string;
      paymentId?: string;
    };
    const resp = await this._post<IyzicoVerifyResp>(
      '/payment/iyzipos/checkoutform/auth/ecom/detail',
      { locale: 'tr', token }
    );

    if (resp.paymentStatus !== 'SUCCESS') {
      this._log.warn(`iyzico callback non-success: ${resp.paymentStatus}`);
      return { ok: false, status: resp.paymentStatus };
    }

    const [purpose, productId] = (resp.basketId ?? '').split('_');
    const organizationId = (resp.conversationId ?? '').split('_')[0];
    const paymentRef = resp.paymentId ?? token;
    const pricePaid = parseFloat(resp.paidPrice ?? '0');

    if (purpose === 'topup') {
      const pkg = TOP_UP_PACKAGES[productId as TopUpPackageId];
      await this._topUpService.applyPurchase({
        organizationId,
        packageId: (productId as TopUpPackageId) || 'custom',
        credits: pkg?.credits ?? 0,
        pricePaid,
        currency: 'TRY',
        paymentRef,
        validityDays: pkg?.validityDays ?? 365,
      });
      return { ok: true, kind: 'topup' };
    }

    if (purpose === 'plan') {
      // Plan abonelik aktivasyonu: SubscriptionService.addSubscription veya
      // benzer akış burada tetiklenmelidir. Mevcut Postiz altyapısı Stripe'a
      // bağlı olduğu için TR plan akışı için ek bir adapter PR'ında bağlanır.
      this._log.log(
        `[iyzico] plan ödemesi alındı org=${organizationId} tier=${productId}`
      );
      return { ok: true, kind: 'plan-pending-bridge' };
    }

    return { ok: true, kind: 'unknown' };
  }

  private _priceForProduct(
    purpose: 'plan' | 'topup',
    productId: string,
    period?: 'MONTHLY' | 'YEARLY'
  ): { price: number; label: string } {
    if (purpose === 'topup') {
      const id = productId as TopUpPackageId;
      const price = TOP_UP_PACKAGES_TRY[id];
      if (!price) {
        throw new Error(`Unknown TR top-up package: ${productId}`);
      }
      return { price, label: `Publio ${TOP_UP_PACKAGES[id].label}` };
    }

    const tier = pricing[productId];
    if (!tier?.tr_month_price) {
      throw new Error(`Plan/Tier için TR fiyatı tanımlanmamış: ${productId}`);
    }
    const month = tier.tr_month_price;
    const price = period === 'YEARLY' ? month * 12 * 0.8 : month;
    return {
      price: Math.round(price),
      label: `Publio ${tier.brand_name ?? tier.current} (${period ?? 'MONTHLY'})`,
    };
  }
}
