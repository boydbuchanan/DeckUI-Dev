"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import { Text, Button } from "@deckai/deck-ui";

import { Offer, User } from "@deckai/client/types/cms";
import { Progress, ProgressStep, ProgressStepStatus } from "@deckai/client/features/offer/Progress";

import Summary from "@deckai/client/features/offer/Summary";
import { formatPrice } from "@deckai/client/utils";
import Me from "@me";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import { EditOfferSidebar } from "@deckai/client/features/offer/EditOfferSidebar";

export default function ViewMyOffer({ session, offer, creator, isAvailable, canMakeOffers }: { 
  session: SessionData,
  creator: User;
  offer: Offer;
  isAvailable: boolean;
  canMakeOffers: boolean;
}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isOfferSidebarOpen, setOfferSidebarOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
  const [userOffer, setUserOffer] = useState<Offer>(offer ?? {});

  useEffect(() => {
    if (hasChanges) {
      Me.getOffer(offer.documentId)
        .then((fetched) => setUserOffer(fetched))
        .catch((error) => console.error("Failed to fetch works:", error));
    }
    setHasChanges(false);
  }, [hasChanges]);

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

  const onChangeOffer = useCallback((offer: Offer) => {
      setUserOffer(offer);
      setHasChanges(true);
      setOfferSidebarOpen(false);
  }, []);
  
  var ProgressSteps: ProgressStep[] = [
    { title: "Offer Made", status: ProgressStepStatus.Completed, icon: "user", description: "Offer Details made by creator" },
    { title: "Purchase", status: ProgressStepStatus.Current, icon: "card", description: "Review offer and complete payment" },
    { title: "Work Pending", status: ProgressStepStatus.Pending, icon: "edit", description: "Your order is in the Creators Queue" },
    { title: "Work In Progress", status: ProgressStepStatus.Pending, icon: "edit", description: "Creator is working on your order" },
    { title: "Review Work", status: ProgressStepStatus.Pending, icon: "eye", description: "Work is awaiting review or feedback" },
    { title: "Approved", status: ProgressStepStatus.Pending, icon: "swoosh", description: "Work has been approved" },
    { title: "Completed", status: ProgressStepStatus.Pending, icon: "star-filled", description: "All work has been completed" },
  ];

  var ProgressHeader: ProgressStep = {
    title: "Estimated Delivery " + userOffer.Delivery,
    description: "The steps this order will go through",
    status: ProgressSteps.some((step) => step.status !== ProgressStepStatus.Completed) ? ProgressStepStatus.Pending : ProgressStepStatus.Completed,
    icon: "truck-time"
  };

  return (
    <PageLayout
      session={session}
      showBreadcrumbs={false}
    >
      <div className="flex w-full h-full justify-center">
        {/* Left Half */}
        <div className="flex flex-col p-4 justify-between">
          {/* Top Header */}
          <div className="flex w-full justify-center items-center p-4">
            <div className="flex flex-col gap-4">
              <Text variant="body-md" color="secondary">
                Your custom offer for: {offer.Title}
              </Text>
              <Text variant="body-xs" color="secondary">
                This creator has made a custom offer for you. Please review the details and proceed with the payment.
              </Text>
              <Text variant="body-xs" color="danger">
                This is your offer.
              </Text>
              
              {!canMakeOffers ? (
                <Text variant="body-xs" color="danger">
                  You can not enable offers. Please review your account to enable offers.
                </Text>
              ) : !isAvailable ? (
                <Text variant="body-xs" color="danger">
                  This offer is not available for purchase. Review Offer and accept terms to enable it.
                </Text>
              ) : null}
            </div>

          </div>
          
          <Summary
            header="Summary"
            title={userOffer.Title}
            description={userOffer.Details}
            formData={{
              Delivery: userOffer.Delivery,
              Expires: userOffer.Expires,
            }}
            footer={{
              Amount: formatPrice(userOffer.Amount),
            }}
            className="min-w-[600px]"
          />
          <div className="flex justify-between items-center mt-6">
            <Button
              className="w-auto mx-auto py-4"
              color="black"
              variant="filled"
              disabled={isOfferSidebarOpen}
              onClick={() => onEditOffer(userOffer)}
            >
              Edit Offer
            </Button>
          </div>
        </div>

        {/* Right Half */}
        <div className="flex p-4">
          <Progress header={ProgressHeader} steps={ProgressSteps} />
        </div>
      </div>
      {/* Bottom Actions */}
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
