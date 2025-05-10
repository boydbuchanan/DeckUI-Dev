"use client";

import React, { useState } from "react";

import { SignedIn } from "@deckai/client/features/auth/SignedIn";
import { SignedOut } from "@deckai/client/features/auth/SignedOut";
import { SessionData } from "@deckai/client/types/session";
import Me from "@me";
import { useToast } from "@deckai/deck-ui";
import { useSiteRouter, useSession } from "@site";
import { CalloutLayout } from "@deckai/client/layout/CalloutLayout";

export default function SignInOut({ session }: { session: SessionData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Router = useSiteRouter();
  const { login, logout } = useSession();
  const { show } = useToast();

  const handleNavigation = async () => {
    show({
      message: "Navigate to profile",
      variant: "default"
    });
    Router.goToMyProfile();
  };

  const handleSignOut = async () => {
    await logout();
    show({
      message: "Successfully signed out",
      variant: "success"
    });
    Router.goToSignIn();
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
    if (register) {
      const registerResponse = await Me.register(
        formData.email,
        formData.password
      );

      show({
        message: "Successfully registered",
        variant: "success"
      });

      if (registerResponse.isLoggedIn) {
        Router.goToMyProfile();
      }
    } else {
      var loginResponse = await login({
        email: formData.email,
        password: formData.password
      });
      show({
        message: "Successfully signed in",
        variant: "success"
      });
      if (loginResponse.isLoggedIn) {
        Router.goToMyProfile();
      }
    }
    setIsSubmitting(false);
  };

  if (session.isLoggedIn) {
    return (
      <CalloutLayout
        title="You are signed in"
        description="Your portfolio, your pitch, your price"
      >
        <SignedIn
          handleSignOut={handleSignOut}
          navigationText="My Profile"
          handleNavigation={handleNavigation}
        />
      </CalloutLayout>
    );
  }

  return (
    <CalloutLayout
      title="Sign In or Register"
      description="Your portfolio, your pitch, your price"
    >
      <SignedOut handleSubmit={handleRegister} disableButton={isSubmitting} />
    </CalloutLayout>
  );

}
