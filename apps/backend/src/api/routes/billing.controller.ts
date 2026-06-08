import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { BillingManagerService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/billing-manager.service';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization, User } from '@prisma/client';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import { TopUpCheckoutDto } from '@gitroom/nestjs-libraries/dtos/billing/top.up.checkout.dto';
import { ByokDto } from '@gitroom/nestjs-libraries/dtos/billing/byok.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUserFromRequest } from '@gitroom/nestjs-libraries/user/user.from.request';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { Request } from 'express';
import { AuthService } from '@gitroom/helpers/auth/auth.service';

@ApiTags('Billing')
@Controller('/billing')
export class BillingController {
  constructor(
    private _subscriptionService: SubscriptionService,
    private _stripeService: StripeService,
    private _notificationService: NotificationService,
    private _billingManager: BillingManagerService
  ) {}

  /* ─────────────── Publio credit-pricing endpoints ─────────────── */

  /** Anlık kredi bakiyesi: plan dahil + top-up + kalan + burst tavanı. */
  @Get('/credits/balance')
  creditBalance(@GetOrgFromRequest() org: Organization) {
    return this._billingManager.getCreditBalance(org);
  }

  /** Sağlayıcı bazında tüketim/maliyet dökümü (şeffaflık paneli). */
  @Get('/credits/usage')
  creditUsage(@GetOrgFromRequest() org: Organization) {
    return this._billingManager.getUsageBreakdown(org);
  }

  /** Her AI aksiyonunun kredi maliyeti + kullanıcı fiyatı (şeffaf katalog). */
  @Get('/credits/catalog')
  creditCatalog() {
    return this._billingManager.getCreditCatalog();
  }

  /** Top-up paket listesi (USD veya TRY). */
  @Get('/topup/packages')
  topUpPackages(@Query('currency') currency?: 'USD' | 'TRY') {
    return this._billingManager.listTopUpPackages(
      currency === 'TRY' ? 'TRY' : 'USD'
    );
  }

  /** Top-up satın alma için Stripe Checkout oturumu açar. */
  @Post('/topup/checkout')
  topUpCheckout(
    @GetOrgFromRequest() org: Organization,
    @Body() body: TopUpCheckoutDto
  ) {
    return this._billingManager.createTopUpCheckout(
      org,
      body.packageId,
      body.returnPath
    );
  }

  /** BYOK durumunu döner (anahtarı asla göstermez). */
  @Get('/byok')
  byokStatus(@GetOrgFromRequest() org: Organization) {
    return this._billingManager.getByokStatus(org);
  }

  /** BYOK anahtarını şifreleyip kaydeder (yalnızca izinli planlar). */
  @Post('/byok')
  setByok(
    @GetOrgFromRequest() org: Organization,
    @Body() body: ByokDto
  ) {
    return this._billingManager.setByok(org, body.provider, body.apiKey);
  }

  /** BYOK anahtarını kaldırır → varsayılan resale moduna döner. */
  @Delete('/byok')
  clearByok(@GetOrgFromRequest() org: Organization) {
    return this._billingManager.clearByok(org);
  }

  @Get('/check/:id')
  async checkId(
    @GetOrgFromRequest() org: Organization,
    @Param('id') body: string
  ) {
    return {
      status: await this._stripeService.checkSubscription(org.id, body),
    };
  }

  @Get('/check-discount')
  async checkDiscount(@GetOrgFromRequest() org: Organization) {
    return {
      offerCoupon: !(await this._stripeService.checkDiscount(org.paymentId))
        ? false
        : AuthService.signJWT({ discount: true }),
    };
  }

  @Post('/apply-discount')
  async applyDiscount(@GetOrgFromRequest() org: Organization) {
    await this._stripeService.applyDiscount(org.paymentId);
  }

  @Post('/finish-trial')
  async finishTrial(@GetOrgFromRequest() org: Organization) {
    try {
      await this._stripeService.finishTrial(org.paymentId);
    } catch (err) {}
    return {
      finish: true,
    };
  }

  @Get('/is-trial-finished')
  async isTrialFinished(@GetOrgFromRequest() org: Organization) {
    return {
      finished: !org.isTrailing,
    };
  }

  @Post('/embedded')
  embedded(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: BillingSubscribeDto,
    @Req() req: Request
  ) {
    const uniqueId = req?.cookies?.track;
    return this._stripeService.embedded(
      uniqueId,
      org.id,
      user.id,
      body,
      org.allowTrial
    );
  }

  @Post('/subscribe')
  subscribe(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: BillingSubscribeDto,
    @Req() req: Request
  ) {
    const uniqueId = req?.cookies?.track;
    return this._stripeService.subscribe(
      uniqueId,
      org.id,
      user.id,
      body,
      org.allowTrial
    );
  }

  @Get('/portal')
  async modifyPayment(@GetOrgFromRequest() org: Organization) {
    const customer = await this._stripeService.getCustomerByOrganizationId(
      org.id
    );
    const { url } = await this._stripeService.createBillingPortalLink(customer);
    return {
      portal: url,
    };
  }

  @Get('/')
  getCurrentBilling(@GetOrgFromRequest() org: Organization) {
    return this._subscriptionService.getSubscriptionByOrganizationId(org.id);
  }

  @Post('/cancel')
  async cancel(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: { feedback: string }
  ) {
    await this._notificationService.sendEmail(
      process.env.EMAIL_FROM_ADDRESS,
      'Subscription Cancelled',
      `Organization ${org.name} has cancelled their subscription because: ${body.feedback}`,
      user.email
    );

    return this._stripeService.setToCancel(org.id);
  }

  @Post('/prorate')
  prorate(
    @GetOrgFromRequest() org: Organization,
    @Body() body: BillingSubscribeDto
  ) {
    return this._stripeService.prorate(org.id, body);
  }

  @Post('/lifetime')
  async lifetime(
    @GetOrgFromRequest() org: Organization,
    @Body() body: { code: string }
  ) {
    return this._stripeService.lifetimeDeal(org.id, body.code);
  }

  @Get('/charges')
  async getCharges(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return this._stripeService.getCharges(org.id);
  }

  @Post('/refund-charges')
  async refundCharges(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization,
    @Body() body: { chargeIds: string[] }
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return this._stripeService.refundCharges(org.id, body.chargeIds);
  }

  @Post('/cancel-subscription')
  async cancelSubscription(
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new HttpException('Unauthorized', 400);
    }

    return this._stripeService.cancelSubscription(org.id);
  }

  @Post('/add-subscription')
  async addSubscription(
    @Body() body: { subscription: string },
    @GetUserFromRequest() user: User,
    @GetOrgFromRequest() org: Organization
  ) {
    if (!user.isSuperAdmin) {
      throw new Error('Unauthorized');
    }

    await this._subscriptionService.addSubscription(
      org.id,
      user.id,
      body.subscription
    );
  }

}
