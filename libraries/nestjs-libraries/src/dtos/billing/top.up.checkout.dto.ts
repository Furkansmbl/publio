import { IsIn, IsOptional, IsString } from 'class-validator';

export class TopUpCheckoutDto {
  @IsIn(['small', 'medium', 'large', 'mega'])
  packageId: 'small' | 'medium' | 'large' | 'mega';

  @IsString()
  @IsOptional()
  returnPath?: string;
}
