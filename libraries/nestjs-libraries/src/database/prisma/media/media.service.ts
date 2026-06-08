import { HttpException, Injectable } from '@nestjs/common';
import { MediaRepository } from '@gitroom/nestjs-libraries/database/prisma/media/media.repository';
import { OpenaiService } from '@gitroom/nestjs-libraries/openai/openai.service';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { Organization } from '@prisma/client';
import { SaveMediaInformationDto } from '@gitroom/nestjs-libraries/dtos/media/save.media.information.dto';
import { VideoManager } from '@gitroom/nestjs-libraries/videos/video.manager';
import { VideoDto } from '@gitroom/nestjs-libraries/dtos/videos/video.dto';
import { UploadFactory } from '@gitroom/nestjs-libraries/upload/upload.factory';
import {
  AuthorizationActions,
  Sections,
  SubscriptionException,
} from '@gitroom/backend/services/auth/permissions/permission.exception.class';
import { CreditCostService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-cost.service';
import { FeatureKey } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/plan-features';

/**
 * Video sağlayıcı id'sini Publio feature flag'ine map'ler.
 * Bilinmeyen sağlayıcılar ana "ai.proModels" gating'ine düşer.
 */
function featureKeyForVideoType(type: string): FeatureKey {
  const lower = type.toLowerCase();
  if (lower.includes('heygen')) return 'video.heyGen';
  if (lower.includes('runway')) return 'video.runway';
  if (lower.includes('pika')) return 'video.pika';
  if (lower.includes('synthesia')) return 'video.synthesia';
  return 'ai.proModels';
}

/**
 * Video sağlayıcı id'sine göre tahmini sağlayıcı maliyetini (USD) döner.
 * Yalnızca AIUsageLog margin raporu içindir; kredi düşümünü etkilemez.
 */
function videoProviderCost(type: string): { provider: string; costUsd: number } {
  const lower = (type || '').toLowerCase();
  if (lower.includes('veo')) return { provider: 'google', costUsd: 0.4 };
  if (lower.includes('heygen')) return { provider: 'heygen', costUsd: 0.5 };
  if (lower.includes('runway')) return { provider: 'runway', costUsd: 0.5 };
  if (lower.includes('pika')) return { provider: 'pika', costUsd: 0.3 };
  if (lower.includes('synthesia')) return { provider: 'synthesia', costUsd: 1.5 };
  return { provider: 'internal', costUsd: 0 };
}

@Injectable()
export class MediaService {
  private storage = UploadFactory.createStorage();

  constructor(
    private _mediaRepository: MediaRepository,
    private _openAi: OpenaiService,
    private _subscriptionService: SubscriptionService,
    private _videoManager: VideoManager,
    private _creditCostService: CreditCostService
  ) {}

  async deleteMedia(org: string, id: string) {
    return this._mediaRepository.deleteMedia(org, id);
  }

  getMediaById(id: string) {
    return this._mediaRepository.getMediaById(id);
  }

  async generateImage(
    prompt: string,
    org: Organization,
    generatePromptFirst?: boolean
  ) {
    // Publio birleşik kredi modeli: görsel üretimi katalog (image.gptImage)
    // kredisi ile düşer; plan dahil aylık krediden + (yetmezse) top-up'tan
    // harcanır, BYOK ise ücretsizdir, hata olursa otomatik refund yapılır.
    const generating = await this._subscriptionService.chargeCredit(
      org,
      'image.gptImage',
      async () => {
        if (generatePromptFirst) {
          prompt = await this._openAi.generatePromptForPicture(prompt);
          console.log('Prompt:', prompt);
        }
        return this._openAi.generateImage(prompt);
      }
    );

    return generating;
  }

  saveFile(org: string, fileName: string, filePath: string, originalName?: string) {
    return this._mediaRepository.saveFile(org, fileName, filePath, originalName);
  }

  getMedia(org: string, page: number, search?: string) {
    return this._mediaRepository.getMedia(org, page, search);
  }

  saveMediaInformation(org: string, data: SaveMediaInformationDto) {
    return this._mediaRepository.saveMediaInformation(org, data);
  }

  getVideoOptions() {
    return this._videoManager.getAllVideos();
  }

  async generateVideoAllowed(org: Organization, type: string) {
    const video = this._videoManager.getVideoByName(type);
    if (!video) {
      throw new Error(`Video type ${type} not found`);
    }

    if (!video.trial && org.isTrailing) {
      throw new HttpException('This video is not available in trial mode', 406);
    }

    // Publio: tier-bazlı feature gate (HeyGen/Runway/Pika/Synthesia).
    // @ts-ignore
    const dbTier = (org as any)?.subscription?.subscriptionTier ?? null;
    // @ts-ignore
    const isEnt = !!(org as any)?.subscription?.isEnterprise;
    this._creditCostService.assertFeature(dbTier, featureKeyForVideoType(type), isEnt);

    return true;
  }

  async generateVideo(org: Organization, body: VideoDto) {
    const totalCredits = await this._subscriptionService.checkCredits(
      org,
      'ai_videos'
    );

    if (totalCredits.credits <= 0) {
      throw new SubscriptionException({
        action: AuthorizationActions.Create,
        section: Sections.VIDEOS_PER_MONTH,
      });
    }

    const video = this._videoManager.getVideoByName(body.type);
    if (!video) {
      throw new Error(`Video type ${body.type} not found`);
    }

    if (!video.trial && org.isTrailing) {
      throw new HttpException('This video is not available in trial mode', 406);
    }

    console.log(body.customParams);
    await video.instance.processAndValidate(body.customParams);
    console.log('no err');

    // Video sağlayıcı maliyetini margin raporu için logla (kredi sayımı
    // mevcut aylık video kotasıyla aynı kalır: 1 kredi / ai_videos).
    const { provider, costUsd } = videoProviderCost(body.type);
    // @ts-ignore
    const byok = !!(org as any)?.subscription?.byokApiKeyEnc;

    return await this._subscriptionService.useCreditWithCost(
      org,
      {
        type: 'ai_videos',
        credits: 1,
        action: `video.${body.type}`,
        provider,
        costUsd,
        byok,
      },
      async () => {
        const loadedData = await video.instance.process(
          body.output,
          body.customParams
        );

        const file = await this.storage.uploadSimple(loadedData);
        return this.saveFile(org.id, file.split('/').pop(), file);
      }
    );
  }

  async videoFunction(identifier: string, functionName: string, body: any) {
    const video = this._videoManager.getVideoByName(identifier);
    if (!video) {
      throw new Error(`Video with identifier ${identifier} not found`);
    }

    // @ts-ignore
    const functionToCall = video.instance[functionName];
    if (
      typeof functionToCall !== 'function' ||
      this._videoManager.checkAvailableVideoFunction(functionToCall)
    ) {
      throw new HttpException(
        `Function ${functionName} not found on video instance`,
        400
      );
    }

    return functionToCall(body);
  }
}
