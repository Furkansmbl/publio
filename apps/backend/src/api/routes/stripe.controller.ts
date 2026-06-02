import {
  Controller,
  HttpException,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { TopUpService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/top-up.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('/stripe')
export class StripeController {
  constructor(
    private readonly _stripeService: StripeService,
    private readonly _topUpService: TopUpService
  ) {}

  @Post('/')
  stripe(@Req() req: RawBodyRequest<Request>) {
    const event = this._stripeService.validateRequest(
      req.rawBody,
      // @ts-ignore
      req.headers['stripe-signature'],
      process.env.STRIPE_SIGNING_KEY
    );

    // @ts-ignore
    const meta = event?.data?.object?.metadata;
    const isTopUp = meta?.service === 'gitroom_topup';
    const isGitroom = meta?.service === 'gitroom';

    // Maybe it comes from another stripe webhook
    if (
      !isGitroom &&
      !isTopUp &&
      event.type !== 'invoice.payment_succeeded'
    ) {
      return { ok: true };
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          // Top-up paketleri sadece bu event'le tetiklenir.
          if (isTopUp) {
            return this._topUpService.applyPurchaseFromStripe(event);
          }
          return { ok: true };
        case 'invoice.payment_succeeded':
          return this._stripeService.paymentSucceeded(event);
        case 'customer.subscription.created':
          return this._stripeService.createSubscription(event);
        case 'customer.subscription.updated':
          return this._stripeService.updateSubscription(event);
        case 'customer.subscription.deleted':
          return this._stripeService.deleteSubscription(event);
        default:
          return { ok: true };
      }
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
