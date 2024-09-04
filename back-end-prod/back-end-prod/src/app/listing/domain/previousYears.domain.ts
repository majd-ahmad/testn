import { IPreviousYear, PreviousYearType } from "../model/previousYear/previousYear.model";

export class PreviousYearDomain implements IPreviousYear {
    id: string;
    year: number;
    value: number;
    type: PreviousYearType;
}
