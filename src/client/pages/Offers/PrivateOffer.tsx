"use client";

import React, { useState } from "react";

import { SignedIn } from "@deckai/client/features/auth/SignedIn";
import { SignedOut } from "@deckai/client/features/auth/SignedOut";
import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Button, Text, useToast } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { CalloutLayout } from "@deckai/client/layout/CalloutLayout";
import { ActionCallout } from "@deckai/client/features/callout/ActionCallout";
import { User } from "@deckai/client/types/cms";

export default function PrivateOffer({ 
  session,
  creator,
}: { 
  session: SessionData 
  creator: User;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Router = useSiteRouter();
  const { login } = useSession();

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
    if (register) {
      const registerResponse = await Me.register(
        formData.email,
        formData.password
      );

      if (registerResponse.isLoggedIn) {
        // reload the page to get the new session
        window.location.reload();
      }
    } else {
      var loginResponse = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (loginResponse.isLoggedIn) {
        window.location.reload();
      }
    }
    setIsSubmitting(false);
  };

  if (session.isLoggedIn) {
    return (
      <CalloutLayout
        title="Sorry, this offer isn't available."
        description="If this is in error, please contact the creator with the email associated with this account."
      >
        <ActionCallout
          title="Looking for Offers?"
          footer={`Find private offers just for you or view ${creator.displayName}'s public offers.`}
        >
          <div className="max-w-[250px] mb-4 flex flex-col items-center gap-4 max-w-md mx-auto">
            <Button
              variant="filled"
              className="w-full"
              onClick={() => {
                Router.myOffers();
              }}
            >
              My Offers
            </Button>
            
            <Button
              variant="filled"
              className="w-full"
              onClick={() => {
                Router.creatorOffers(creator);
              }}
            >
              <Text variant="body-xxs-semibold" color="white" className="text-center">
                {creator.displayName} Offers
              </Text>
            </Button>
            <Button
              variant="filled"
              className="w-full"
              onClick={() => {
                Router.explore();
              }}
            >
              Find Creators
            </Button>
            
            <Button
              variant="filled"
              className="w-full"
              onClick={() => {
                Router.goToSignIn();
              }}
            >
              Sign Out
            </Button>
          </div>
        </ActionCallout>
      </CalloutLayout>
    );
  }

  return (
    <CalloutLayout
        title="This offer is private"
        description="Sign in to view this offer"
    >
      <ActionCallout>
        <SignedOut handleSubmit={handleRegister} disableButton={isSubmitting} />
      </ActionCallout>
    </CalloutLayout>
  );

}
