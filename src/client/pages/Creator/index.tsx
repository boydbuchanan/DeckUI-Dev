"use client";

import React, { useCallback, useEffect, useState } from "react";
import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { Text, Button } from "@deckai/deck-ui";
import { useSiteRouter } from "@site";
import { StripeAccountStatus, User, Work } from "@deckai/client/types/cms";

import { Progress, ProgressStep, ProgressStepStatus } from "@deckai/client/features/offer/Progress";
import { UserLayout } from "@deckai/client/layout/UserLayout";
import Stripe from "stripe";
import { SidebarTab } from "@deckai/client/features/profile/ProfileEditor";

export default function Creator({ 
  session, 
  currentUser, 
  stripeAccount 
}: { 
  session: SessionData,
  currentUser: User;
  stripeAccount?: Stripe.Account
}) {
  const Router = useSiteRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileEditorOpen, setProfileEditorOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(SidebarTab.About);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);
  const [accountRequirements, setAccountRequirements] = useState<string[]>([]);

  const [uploadWorkProgress, setUploadWorkProgress] = useState<ProgressStepStatus>(ProgressStepStatus.Loading);
  const [works, setWorks] = useState<Work[] | undefined>(undefined);

  useEffect(() => {
    if (stripeAccount) {
      setAccountStatus(stripeAccount.requirements?.disabled_reason || null);
      setAccountRequirements(stripeAccount.requirements?.currently_due || []);
    }
  }, [stripeAccount]);

  useEffect(() => {
    if (!works || works.length === 0) {
      Me.works()
        .then((fetched) => {
          setWorks(fetched);
          var workprogress = !fetched || fetched.length === 0 ? ProgressStepStatus.Pending : ProgressStepStatus.Current;
          if(fetched && fetched.some((work) => work.interest != null)){
            workprogress = ProgressStepStatus.Completed;
          }
          setUploadWorkProgress(workprogress);
        })
        .catch((error) => console.error("Failed to fetch works:", error));
    } else {
      setUploadWorkProgress(ProgressStepStatus.Pending);
    }
  }, []);

  const handleStripeAccountAction = async () => {
    setIsLoading(true);
    try {
      const response = await Me.onboarding();
      if (response.stripeAccountLink) {
        window.location.href = response.stripeAccountLink;
      } else {
        throw new Error('Failed to create or update Stripe account');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleNavigation = async () => {
    Router.goToMyProfile();
  };

  const profileStepClick = useCallback(() => {
    setCurrentTab(SidebarTab.About);
    setProfileEditorOpen(true);
  }, []);

  const workStepClick = () => {
    setCurrentTab(SidebarTab.Work);
    setProfileEditorOpen(true);
  }

  var profileImageProgress: ProgressStepStatus = currentUser?.avatar ? ProgressStepStatus.Completed : ProgressStepStatus.Pending;
  var displayNameProgress: ProgressStepStatus = currentUser?.displayName ? ProgressStepStatus.Completed : ProgressStepStatus.Pending;
  var profileDescriptionProgress: ProgressStepStatus = currentUser?.aboutMe ? ProgressStepStatus.Completed : ProgressStepStatus.Pending;
  var setInterestsProgress: ProgressStepStatus = currentUser?.interests && currentUser?.interests.length > 0 ? ProgressStepStatus.Completed : ProgressStepStatus.Pending;
  
  var stripeAccountStatus: ProgressStepStatus = ProgressStepStatus.Pending;
  if (currentUser?.stripeAccountStatus === StripeAccountStatus.Active)
    stripeAccountStatus = ProgressStepStatus.Completed;
  else if (currentUser?.stripeAccountStatus === StripeAccountStatus.Incomplete)
    stripeAccountStatus = ProgressStepStatus.Current;

  var ProgressSteps: ProgressStep[] = [
    { title: "Profile Image", status: profileImageProgress, icon: "user", description: "Upload an image for your profile", onClick: profileStepClick },
    { title: "Display Name", status: displayNameProgress, icon: "edit", description: "Set your name", onClick: profileStepClick },
    { title: "Profile Description", status: profileDescriptionProgress, icon: "edit", description: "What should potential clients know about you or your platform?", onClick: profileStepClick },
    { title: "Set Interests", status: setInterestsProgress, icon: "edit", description: "Add interests to your profile", onClick: profileStepClick },
    { title: "Upload Work", status: uploadWorkProgress, icon: "camera", description: "Upload work to your interests", onClick: workStepClick },
    { title: "Setup Stripe Account", status: stripeAccountStatus, icon: "bank", description: "Setup your financial information" },
  ];

  let finishedOnboarding: boolean = !ProgressSteps.some((step) => step.status !== ProgressStepStatus.Completed);

  var ProgressHeader: ProgressStep = {
    title: finishedOnboarding ? "You're All Set!" : "Become a Creator",
    description: "Complete these steps and create your first offer",
    status: finishedOnboarding ? ProgressStepStatus.Completed : ProgressStepStatus.Pending,
    icon: "user"
  };

  return (
    <UserLayout
      currentUser={currentUser}
      openEditor={isProfileEditorOpen}
      onClose={() => setProfileEditorOpen(false)}
      showTab={currentTab}
    >
      <div className="flex w-full h-full">
        {/* Left Half */}
        <div className="flex-1 p-4">
          <Progress header={ProgressHeader} steps={ProgressSteps}>
            <Button
              className="w-auto mx-auto py-4"
              color="accent"
              variant="filled"
              disabled={!finishedOnboarding}
              onClick={() => Router.myOffers()}
            >
              Create an Offer
            </Button>
          </Progress>
        </div>

        {/* Right Half */}
        <div className="flex-1 p-4">
          <Text variant="heading-md">Stripe Account</Text>
          <div className="w-full flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {stripeAccount ? (
              <>
                <p>Account ID: {stripeAccount.id}</p>
                <p>Business Name: {stripeAccount.business_profile?.name}</p>
                <p>Payouts Enabled: {stripeAccount.payouts_enabled ? 'Yes' : 'No'}</p>
                <p>Charges Enabled: {stripeAccount.charges_enabled ? 'Yes' : 'No'}</p>
                {accountStatus && (
                  <p>Account Status: {accountStatus}</p>
                )}
                {accountRequirements.length > 0 && (
                  <div>
                    <p>Outstanding Requirements:</p>
                    <ul>
                      {accountRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                    <Button onClick={handleStripeAccountAction} disabled={isLoading}>
                      {isLoading ? 'Redirecting...' : 'Complete Requirements'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>No account details available.</p>
                <Button onClick={handleStripeAccountAction} disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Setup Connected Account'}
                </Button>
              </>
            )}
            {stripeAccount && stripeAccount.type === 'express' && (
              <Button
                className="w-auto mx-auto py-4"
                color="black"
                variant="filled"
                onClick={() => {
                  window.open(`https://connect.stripe.com/express/${stripeAccount.id}`);
                }}
              >
                View Express Dashboard
              </Button>
            )}
            {stripeAccount && stripeAccount.type === 'standard' && (
              <Button
                className="w-auto mx-auto py-4"
                color="black"
                variant="filled"
                onClick={() => {
                  window.open('https://dashboard.stripe.com');
                }}
              >
                Access Stripe Dashboard
              </Button>
            )}
            <div className="flex flex-row gap-4">
              <Button
                className="w-auto mx-auto py-4"
                color="black"
                variant="filled"
                disabled={isLoading}
                onClick={handleNavigation}
              >
                Return
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
