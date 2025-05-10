"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { useToast } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { Offer, User } from "@deckai/client/types/cms";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import OfferCard from "@deckai/client/features/offer/OfferCard";
import ActionCard from "@deckai/client/features/offer/ActionCard";

export default function ViewOffers({ session, creator, offers, canRequestOffers }: { 
  session: SessionData,
  creator: User;
  offers?: Offer[];
  canRequestOffers?: boolean;
}) {
  const Router = useSiteRouter();
  const [userOffers, setUserOffers] = useState<Offer[]>(offers ?? []);

  return (
    <PageLayout
      session={session}
    >
      <div key='tilegrid' className="container m-auto grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2 justify-center">
        {canRequestOffers && (
        <ActionCard 
          description={"Want something you don't see? Request a custom offer!"}
          key={0}
          title={"Request Offer"}
          // actionText="Request Custom Offer"
          // onClick={editOfferFunction(undefined)}
        />
        )}
        
        {userOffers.map((offer) => (
          <OfferCard 
            description={offer.Details}
            key={offer.id}
            title={offer.Title}
            username={offer.ForEmail}
            date={offer.Expires}
            onClick={() => {
              Router.offer(offer);
            }}
          />
        ))}
      </div>
    </PageLayout>
  );
}
