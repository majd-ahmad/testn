import { IFranchise } from "../application/model/franchise/franchise.model";

export class FranchiseDomain implements IFranchise {
    id: string;
    accountId: string;
}