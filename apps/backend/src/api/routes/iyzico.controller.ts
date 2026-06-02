import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IyzicoService } from '@gitroom/nestjs-libraries/services/iyzico.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { GetUserFromRequest } from '@gitroom/nestjs-libraries/user/user.from.request';
import { Organization, User } from '@prisma/client';

/**
 * Publio iyzico HTTP yüzeyi. TR fatura adresine sahip kullanıcılar
 * (`subscription.billingCountry === 'TR'`) için abonelik veya top-up ödemesi
 * yapar. Stripe controller'ından bağımsızdır; ödeme sonrası callback iyzico
 * tarafından `IYZICO_CALLBACK_URL`'e POST edilir.
 */
@ApiTags('iyzico')
@Controller('/iyzico')
export class IyzicoController {
  private readonly _log = new Logger(IyzicoController.name);

  constructor(private readonly _iyzico: IyzicoService) {}

  /** Hosted form linki üretir. Frontend bu URL'e yönlendirir. */
  @Post('/checkout')
  async createCheckout(
    @Body()
    body: {
      purpose: 'plan' | 'topup';
      productId: string;
      period?: 'MONTHLY' | 'YEARLY';
      buyer: {
        name: string;
        surname: string;
        email: string;
        identityNumber?: string;
        address: string;
        city: string;
        country?: string;
        gsmNumber?: string;
      };
    },
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User
  ) {
    return this._iyzico.initCheckoutForm({
      organizationId: org.id,
      purpose: body.purpose,
      productId: body.productId,
      period: body.period,
      buyer: {
        id: user.id,
        name: body.buyer.name,
        surname: body.buyer.surname,
        email: body.buyer.email || user.email || 'noreply@publio.app',
        identityNumber: body.buyer.identityNumber,
        registrationAddress: body.buyer.address,
        city: body.buyer.city,
        country: body.buyer.country || 'Turkey',
        ip: (user as { ip?: string }).ip || '127.0.0.1',
        gsmNumber: body.buyer.gsmNumber,
      },
    });
  }

  /**
   * iyzico Hosted Form geri çağrısı. iyzico, kullanıcıyı bu URL'e POST eder
   * (form-data: `token`). Auth gerektirmez — imza zaten retrieve çağrısında
   * iyzico API ile doğrulanır.
   */
  @Post('/callback')
  async callback(@Body('token') token: string) {
    if (!token) {
      this._log.warn('iyzico callback eksik token');
      return { ok: false };
    }
    return this._iyzico.handleCallback(token);
  }

  /** Pricing sayfası TR fiyatlarını çekmek için. */
  @Get('/packages')
  packages(@Query('currency') currency: 'USD' | 'TRY' = 'TRY') {
    // TopUpService'in zaten listPackages metodu var — direkt iyzico'da da
    // yansıtmak için thin proxy.
    return { currency };
  }
}
