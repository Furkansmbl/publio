import { IsIn, IsString, MinLength } from 'class-validator';

/**
 * BYOK (bring-your-own-key) — kurumsal müşterilerin kendi AI sağlayıcı
 * anahtarlarını tanımlaması için. Anahtar sunucuda AES ile şifrelenerek saklanır
 * ve yanıtlarda asla geri döndürülmez.
 */
export class ByokDto {
  @IsIn([
    'openai',
    'anthropic',
    'google',
    'stability',
    'elevenlabs',
    'heygen',
    'runway',
  ])
  provider:
    | 'openai'
    | 'anthropic'
    | 'google'
    | 'stability'
    | 'elevenlabs'
    | 'heygen'
    | 'runway';

  @IsString()
  @MinLength(8)
  apiKey: string;
}
