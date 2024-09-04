import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { SellerQnADomain } from '../../domain/sellerQnA.domain';

export interface ISellerQnA {
  uniqueValueProposition?: string;
  keyProductsOrServices?: string;
  intellectualProperty?: string;
  legalIssues?: string;
  challengesOrRisks?: string;
}
export class SellerQnAModel implements ISellerQnA {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Question or answer should be less than 500 characters.' })
  @ApiPropertyOptional({
    default:"Unique Value Proposition"
  })
  uniqueValueProposition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Question or answer should be less than 500 characters.' })
  @ApiPropertyOptional({
    default:"Key Products or Services"
  })
  keyProductsOrServices?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Question or answer should be less than 500 characters.' })
  @ApiPropertyOptional({
    default:"Intellectual Property"
  })
  intellectualProperty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Question or answer should be less than 500 characters.' })
  @ApiPropertyOptional({
    default:"Legal Issues"
  })
  legalIssues?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Question or answer should be less than 500 characters.' })
  @ApiPropertyOptional({
    default:"Challenges or Risks"
  })
  challengesOrRisks?: string;

  constructor(data: ISellerQnA) {
    Object.assign(this, data);
  }

  static fromDomain(domain: SellerQnADomain): SellerQnAModel {
    return new SellerQnAModel(domain);
  }
}
