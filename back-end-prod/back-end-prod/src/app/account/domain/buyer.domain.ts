import { BusinessStage } from "src/app/listing/domain/enums/businessStage.enum";
import { IBuyer } from "../application/model/buyer/buyer.model";
import { InterestedIn } from "./enums/interestedIn.enum";

export class BuyerDomain implements IBuyer {
    id: string;
    interestedIn: InterestedIn;
    businessStage: BusinessStage;
    preferredIndustry: string[];
    preferredCountry: string;
    preferredCities: string[];
    aboutBuyer: string;
    aspectsLookedInto: string;
    investmentRange: string;
    preferredTimeFrame?: string;
    accountId: string;
}