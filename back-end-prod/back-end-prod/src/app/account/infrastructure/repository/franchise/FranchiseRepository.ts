import { Injectable } from '@nestjs/common';
import { IFranchiseRepository } from './IFranchiseRepository';

@Injectable()
export class FranchiseRepository implements IFranchiseRepository { }