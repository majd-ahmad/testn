import { Inject, Injectable } from "@nestjs/common";
import { IBuyerRepository, IBuyerRepositoryToken } from "../infrastructure/repository/buyer/IBuyerRepository";
import { IEVENTEMITTERS, IEventEmitters } from "src/event-emmiter/IEventEmitters";
import { Prisma } from "@prisma/client";
import { BuyerModel } from "./model/buyer/buyer.model";
import { AccountService } from "./account.service";

@Injectable()
export class BuyerService implements IBuyerRepository {
    constructor(
        @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
        @Inject(IBuyerRepositoryToken) readonly buyerRepo: IBuyerRepository,
        private readonly accountService: AccountService,
    ) { }

    async findAll(params?: {
        include: Prisma.BuyerInclude;
    }): Promise<BuyerModel[]> {
        const docs = await this.buyerRepo.findAll(params)
        return docs.map((doc) => BuyerModel.fromDomain(doc))
    }

    async create(buyer: BuyerModel): Promise<BuyerModel> {

        const exists = await this.alreadyExists(
            buyer.accountId,
        );

        if (exists) {
            throw new Error('Account already has buyer profile exists')
        }
        const doc = await this.buyerRepo.create(buyer)

        const owner = await this.accountService.getAccountById(buyer.accountId)
        console.log('owner', owner)
        // this.eventEmitter.emit(EVENTS.BUSINESS_PROFILE_SUBMITTED, {
        //     email: owner.email,
        //     name: `${owner?.firstName ?? ""} ${owner?.lastName ?? ""}`,
        // })
        return BuyerModel.fromDomain(doc)

    }

    async findById(id: string): Promise<BuyerModel | null> {
        const doc = await this.buyerRepo.findById(id)
        if (!doc) {
            return null
        }
        return BuyerModel.fromDomain(doc)
    }

    async findByAccountId(accountId: string): Promise<BuyerModel | null> {
        const doc = await this.buyerRepo.findByAccountId(accountId)
        if (!doc) {
            return null
        }
        return BuyerModel.fromDomain(doc)
    }

    async update(accountId: string, buyer: Partial<BuyerModel>): Promise<BuyerModel> {
        const foundBuyer = await this.buyerRepo.findByAccountId(
            accountId,
        );
        if (!foundBuyer) {
            throw new Error('Buyer profile not found')
        }
        const doc = await this.buyerRepo.update(foundBuyer.id, buyer)
        return BuyerModel.fromDomain(doc)
    }

    async delete(id: string): Promise<void> {
        return this.buyerRepo.delete(id)
    }

    private async alreadyExists(accountId: string): Promise<boolean> {
        const account = await this.buyerRepo.findByAccountId(accountId);
        return account !== null;
    }
}