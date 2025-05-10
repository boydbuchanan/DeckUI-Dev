"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { SessionData } from "@deckai/client/types/session";
import { Text, Button } from "@deckai/deck-ui";

import { Offer, User } from "@deckai/client/types/cms";
import { Progress, ProgressStep, ProgressStepStatus } from "@deckai/client/features/offer/Progress";

import Summary from "@deckai/client/features/offer/Summary";
import { formatPrice } from "@deckai/client/utils";

import Api from "@api";
import { PageLayout } from "@deckai/client/layout/PageLayout";
import { SignedOut } from "@deckai/client/features/auth/SignedOut";
import { ActionCallout } from "@deckai/client/features/callout/ActionCallout";
import { useSession } from "@site";
import Me from "@me";

export default function ViewOffer({ session, offer, creator, isAvailable }: { 
  session: SessionData,
  creator: User;
  offer: Offer;
  isAvailable: boolean;
}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(session.isLoggedIn);
  
  const { login } = useSession();
  const startCheckout = async () => {
    if(!isSignedIn) {
      setShowSignIn(true);
      return;
    }
    if(isLoading) return;
    await setIsLoading(true);

    var session = await Api.createCheckout(offer);

    window.location.href = session.url;
  };
  
  const handleRegister = async ({
    email,
    password,
    register
  }: {
    email: string;
    password: string;
    register: boolean;
  }) => {
    setIsSubmitting(true);
    const formData = { email, password };
    setIsLoading(true);
    if (register) {
      const registerResponse = await Me.register(
        formData.email,
        formData.password
      );
      setIsSignedIn(registerResponse.isLoggedIn);
    } else {
      var loginResponse = await login({
        email: formData.email,
        password: formData.password
      });
      
      setIsSignedIn(loginResponse.isLoggedIn);
    }
    setShowSignIn(false);
    setIsLoading(false);
    setIsSubmitting(false);
  };

  
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
    title: "Estimated Delivery " + offer.Delivery,
    description: "Complete these steps and create your first offer",
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
              {!isAvailable && (
                <Text variant="body-xs" color="danger">
                  This offer is not available at this time. Please contact the creator for more information.
                </Text>
              )}
            </div>
          </div>
          {showSignIn && (
            <div className="flex w-full justify-center items-center p-4">
              
              <ActionCallout>
                <SignedOut handleSubmit={handleRegister} disableButton={isSubmitting} />
              </ActionCallout>
            </div>
          ) || (
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
          )}
          {/* Checkout Button */}
          <div className="flex justify-between items-center mt-6">
            <Button
              className="w-auto mx-auto py-4"
              color="black"
              variant="filled"
              disabled={!isAvailable || isLoading || showSignIn}
              onClick={startCheckout}
            >
              {!isAvailable ? "Offer Unavailable" : isLoading ? 'Processing...' : 'Checkout'}
            </Button>
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
