import { Injectable } from '@nestjs/common';
import { ISellerRepository } from './ISellerRepository';

@Injectable()
export class SellerRepository implements ISellerRepository {}