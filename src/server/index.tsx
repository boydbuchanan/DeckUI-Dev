import { Offer, StripeAccountStatus, User } from "@deckai/client/types/cms";

export const offersEnabled = (user: User) => {
    return user.IsCreatorAvailable && user.stripeAccountStatus === StripeAccountStatus.Active && user.stripeChargesEnabled;
}