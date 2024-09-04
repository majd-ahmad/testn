import { Prisma } from "@prisma/client";
import { BuyerModel } from "src/app/account/application/model/buyer/buyer.model";
import { BuyerDomain } from "src/app/account/domain/buyer.domain";

export interface IBuyerRepository {
    findAll(params?: { include: Prisma.BuyerInclude }): Promise<BuyerDomain[]>;
    create(buyer: BuyerModel): Promise<BuyerDomain>;
    findById(id: string): Promise<BuyerDomain | null>;
    findByAccountId(accountId: string): Promise<BuyerDomain | null>;
    update(id: string, buyer: Partial<BuyerModel>): Promise<BuyerDomain>;
    delete(id: string): Promise<void>;
}


export const IBuyerRepositoryToken = Symbol('IBuyerRepository');