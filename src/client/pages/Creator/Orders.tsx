"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Text, Button, useToast, OrderSummary, OrderCard, OrderCardProps } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { OfferState, Order, OrderState, User } from "@deckai/client/types/cms";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import OfferCard from "@deckai/client/features/offer/OfferCard";

export default function Offers({ session, user, orders }: { 
  session: SessionData,
  user?: User;
  orders?: Order[];
}) {
  const Router = useSiteRouter();
  
  const [hasChanges, setHasChanges] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>(orders ?? []);
  
  useEffect(() => {
    if (hasChanges) {
      Me.orders()
        .then((fetched) => setUserOrders(fetched))
        .catch((error) => console.error("Failed to fetch works:", error));
    }
    setHasChanges(false);
  }, [hasChanges]);

  const { show } = useToast();

  return (
    <PageLayout
      session={session}
    >
      <div key='tilegrid' className="container m-auto grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2 justify-center">
        
        {userOrders.map((order) => (
          <OfferCard 
            description={order.Details}
            key={order.documentId}
            
            title={order.Title}
            username={order.stripeCustomerName ?? ""}
            
            status={order.State !== OrderState.Completed ? OfferState.Enabled : OfferState.Unavailable}
            onClick={() => {
              Router.order(order);
            }}
          />
        ))}
      </div>
    </PageLayout>
  );
}
