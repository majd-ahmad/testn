import { ISellerQnA } from "../model/qaSeller/qaSeller.model";

export class SellerQnADomain implements ISellerQnA {
    id: string;
    uniqueValueProposition?: string;
    keyProductsOrServices?: string;
    intellectualProperty?: string;
    legalIssues?: string;
    challengesOrRisks?: string;
}
