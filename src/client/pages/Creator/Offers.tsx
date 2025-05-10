"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Text, Button, useToast, OrderSummary, OrderCard, OrderCardProps } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { Offer, OfferState, StripeAccountStatus, UpdateOffer, User } from "@deckai/client/types/cms";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import { EditOfferSidebar } from "@deckai/client/features/offer/EditOfferSidebar";
import OfferCard from "@deckai/client/features/offer/OfferCard";
import ActionCard from "@deckai/client/features/offer/ActionCard";
import { isOfferExpired } from "@deckai/client";

export default function Offers({ session, creator, offers, canMakeOffers }: { 
  session: SessionData,
  creator: User;
  offers?: Offer[];
  canMakeOffers: boolean;
}) {
  const Router = useSiteRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isOfferSidebarOpen, setOfferSidebarOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
  const [userOffers, setUserOffers] = useState<Offer[]>(offers ?? []);

  useEffect(() => {
    if (hasChanges) {
      Me.offers()
        .then((fetched) => setUserOffers(fetched))
        .catch((error) => console.error("Failed to fetch works:", error));
    }
    setHasChanges(false);
  }, [hasChanges]);

  const { show } = useToast();

  const onChangeOffer = useCallback((offer: Offer) => {
    setHasChanges(true);
    setOfferSidebarOpen(false);
    show({
      message: "Offer updated successfully",
      variant: "success",
    });
  }, []);

  const onEditOffer = useCallback((offer?: Offer) => {
    setSelectedOffer(offer);
    setOfferSidebarOpen(true);
  }, []);

  var editOfferFunction = useCallback((offer?: Offer) => {
    if (!canMakeOffers) {
      return undefined;
    }
    return () => onEditOffer(offer);
  }
  , [canMakeOffers, onEditOffer]);

  return (
    <PageLayout
      session={session}
    >
      <div key='tilegrid' className="container m-auto grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2 justify-center">
        {!canMakeOffers ? (
          <ActionCard 
            description={"Your Stripe account is not active. Please fix or finish setting up your stripe account."}
            key={0}
            title={"Stripe Account Pending"}
            actionText="Setup Stripe Account"
            onClick={() => {
              Router.creator();
            }}
          />
        ) : (
        <ActionCard 
          description={"Does your client have any specific requests? Please provide the necessary details and share them with your client."}
          key={0}
          title={"Create new offer"}
          actionText="Create Offer"
          onClick={editOfferFunction(undefined)}
        />
        )}
        
        {userOffers.map((offer) => (
          <OfferCard 
            description={offer.Details}
            key={offer.id}
            title={offer.Title}
            username={offer.ForEmail}
            date={new Date(offer.Expires).toLocaleDateString()}
            inDanger={!canMakeOffers || isOfferExpired(offer)}
            type={offer.Type}
            status={canMakeOffers ? offer.State : OfferState.Unavailable }
            onClick={() => {
              Router.offer(offer);
            }}
            onClickEdit={editOfferFunction(offer)}
          />
        ))}
      </div>
      {isOfferSidebarOpen && (
        <EditOfferSidebar
          open={isOfferSidebarOpen}
          onClose={() => setOfferSidebarOpen(false)}
          entity={selectedOffer}
          canEnableOffer={canMakeOffers}
          onChange={(offer) => {
            onChangeOffer(offer);
          }}
        />
      )}
    </PageLayout>
  );
}
