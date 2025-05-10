"use client";

import React, { useCallback, useEffect, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Text, Button, useToast, OrderSummary } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { Offer, User } from "@deckai/client/types/cms";
import { Progress, ProgressStep, ProgressStepStatus } from "@deckai/client/features/offer/Progress";
import { UserLayout } from "@deckai/client/layout/UserLayout";
import Summary from "@deckai/client/features/offer/Summary";
import { formatPrice } from "@deckai/client/utils";
import { Config } from "@deckai/client";
import { loadStripe } from "@stripe/stripe-js";
import Api from "@api";
import { PageLayout } from "@deckai/client/layout/PageLayout";

const Stripe = loadStripe(Config.STRIPE_PUBLIC_KEY);

export default function OrderSuccess({ session, offer }: { 
  session: SessionData,
  offer: Offer;
}) {
  
  const [isLoading, setIsLoading] = useState(false);
  
  var ProgressSteps: ProgressStep[] = [
    { title: "Offer Made", status: ProgressStepStatus.Completed, icon: "user", description: "Offer Details made by creator" },
    { title: "Purchase", status: ProgressStepStatus.Completed, icon: "card", description: "Review offer and complete payment" },
    { title: "Work Pending", status: ProgressStepStatus.Current, icon: "edit", description: "Your order is in the Creators Queue" },
    { title: "Work In Progress", status: ProgressStepStatus.Pending, icon: "edit", description: "Creator is working on your order" },
    { title: "Review Work", status: ProgressStepStatus.Pending, icon: "eye", description: "Work is awaiting review or feedback" },
    { title: "Approved", status: ProgressStepStatus.Pending, icon: "swoosh", description: "Work has been approved" },
    { title: "Completed", status: ProgressStepStatus.Pending, icon: "star-filled", description: "All work has been completed" },
  ];

  var ProgressHeader: ProgressStep = {
    title: "Estimated Delivery " + offer.Delivery,
    description: "Your order is processing and will be sent to your creator to start work",
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
                Purchase Completed for: {offer.Title}
              </Text>
              <Text variant="body-xs" color="secondary">
                The order is processing and will go into the Creator&apos;s Queue. You will be notified when the order is ready for review.
              </Text>
            </div>
          

          </div>
          
          <Summary
            header="Summary"
            title={offer.Title}
            description={offer.Details}
            formData={{
              Delivery: offer.Delivery,
              Expires: offer.Expires,
            }}
            footer={{
              Amount: formatPrice(offer.Amount),
            }}
            className="min-w-[600px]"
          />
          <div className="flex justify-between items-center mt-6">
{/*             
          <Button
            className="w-auto mx-auto py-4"
            color="black"
            variant="filled"
            disabled={isLoading}
            onClick={startCheckout}
          >
            {isLoading ? 'Processing...' : 'Checkout'}
          </Button> */}
          
          </div>
        </div>

        {/* Right Half */}
        <div className="flex p-4">
          <Progress header={ProgressHeader} steps={ProgressSteps} />
        </div>
      </div>
      {/* Bottom Actions */}
      {/* <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-row gap-4">
          <Button
            className="w-auto mx-auto py-4"
            color="black"
            variant="filled"
            disabled={isLoading}
            onClick={handleNavigation}
          >
            Checkout
          </Button>

        </div>
      </div> */}
      
    </PageLayout>
  );
}
