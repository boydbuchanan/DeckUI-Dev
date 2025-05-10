import { Button, Text, useToast } from "@deckai/deck-ui";
import React, { useCallback, useState } from "react";
import { CalloutLayout } from "@deckai/client/layout/CalloutLayout";

type SignedInProps = {
  handleSignOut?: () => void;
  navigationText?: string;
  handleNavigation?: () => void;
};

export const SignedIn = ({
  handleSignOut,
  navigationText = "My Profile",
  handleNavigation
}: SignedInProps) => {
  const { show } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onNavigationClicked = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    handleNavigation?.();
  }, []);

  const onSignoutClicked = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        handleSignOut?.();
        show({
          message: "Successfully signed out",
          variant: "success"
        });
      } catch (error) {
        show({
          message: "Failed to sign out",
          variant: "error"
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, show]
  );
  return (
    <div className="w-full min-h-full max-w-screen my-auto mx-auto p-8 bg-background-0 rounded-xl">
      <div className="flex flex-col items-center gap-8 px-10 pt-12 max-w-md mx-auto">
        <Text variant="heading-md">You&apos;re Signed In</Text>
        <Button
          className="w-full py-4"
          color="black"
          variant="filled"
          disabled={isSubmitting}
          onClick={onSignoutClicked}
        >
          Sign Out
        </Button>
        <div className="w-full flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <Text variant="body-md" color="secondary">
            {" "}
            OR{" "}
          </Text>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <Button
          className="w-full py-4"
          color="black"
          variant="outlined"
          onClick={onNavigationClicked}
        >
          {navigationText}
        </Button>
      </div>
    </div>
  );
};
