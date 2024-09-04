import { ISeller } from "../application/model/seller/seller.model";

export class SellerDomain implements ISeller {
    id: string;
    accountId: string;
}