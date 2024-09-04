import { Injectable } from '@nestjs/common';
import { IBuyerRepository } from './IBuyerRepository';
import { DatabaseService } from 'src/database/database.service';
import { BuyerDomain } from 'src/app/account/domain/buyer.domain';
import { Buyer, Prisma } from '@prisma/client';
import { GenericMapper } from 'src/utils/GenericMapper';
import { BuyerModel } from 'src/app/account/application/model/buyer/buyer.model';

@Injectable()
export class BuyerRepository implements IBuyerRepository {
    constructor(private db: DatabaseService) { }

    async findAll(params: { include: Prisma.BuyerInclude } = { include: {} }): Promise<BuyerDomain[]> {
        const { include } = params;
        const docs: Buyer[] = await this.db.buyer.findMany({
            include
        });
        return docs.map((doc) =>
            GenericMapper.mapPrismaEntityToDomain(doc, BuyerDomain),
        );
    }

    async create(buyer: BuyerModel): Promise<BuyerDomain> {
        const createdBuyer = await this.db.buyer.create({
            data: buyer,
        });
        return GenericMapper.mapPrismaEntityToDomain(createdBuyer, BuyerDomain);
    }

    async findById(id: string): Promise<BuyerDomain | null> {
        const doc = await this.db.buyer.findFirst({
            where: { id },
        });
        return doc ? GenericMapper.mapPrismaEntityToDomain(doc, BuyerDomain) : null;
    }

    async findByAccountId(accountId: string): Promise<BuyerDomain> {
        const doc = await this.db.buyer.findFirst({
            where: { accountId },
        });
        return doc ? GenericMapper.mapPrismaEntityToDomain(doc, BuyerDomain) : null;
    }

    async update(id: string, buyer: Partial<BuyerModel>): Promise<BuyerDomain> {
        const updatedBuyer = await this.db.buyer.update({
            where: { id },
            data: buyer,
        });
        return GenericMapper.mapPrismaEntityToDomain(updatedBuyer, BuyerDomain);
    }

    async delete(id: string): Promise<void> {
        await this.db.buyer.delete({
            where: { id },
        });
    }
}