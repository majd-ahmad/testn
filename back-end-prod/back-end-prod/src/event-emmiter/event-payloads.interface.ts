import { EVENTS } from './events';
import { AccountModel } from '../app/account/application/model/account';
import { ListingDetails } from '../app/listing/model/ListingDetails';

export type EventPayload = {
  [EVENTS.ACCOUNT_CREATED]: {
    email: string;
    name: string;
  };
  [EVENTS.EMAIL_VERIFY]: {
    email: string;
    name: string;
    digits: number;
  };
  [EVENTS.ACCOUNT_PASSWORD_FORGET]: {
    email: string;
    name: string;
    token: string;
  };
  [EVENTS.ACCOUNT_PASSWORD_RESET]: {
    email: string
  };
  [EVENTS.SELLER_CONTACT]: {
    email: string;
    name: string;
    owner: AccountModel;
    listing: ListingDetails;
  };
  [EVENTS.SEND_FOR_APPROVAL]: {
    email: string;
    listing: ListingDetails;
    token: string;
  };
  [EVENTS.BUSINESS_PROFILE_SUBMITTED]: {
    email: string;
    name: string;
    businessName: string;
    businessId: string;
  };
  [EVENTS.BUSINESS_PROFILE_APPROVED]: {
    email: string;
    name: string;
    businessName: string;
    businessId: string;
  };
  [EVENTS.BUSINESS_PROFILE_REJECTED]: {
    email: string;
    name: string;
    businessName: string;
    businessId: string;
    reason: string;
  };
};
