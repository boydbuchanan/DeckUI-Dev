import {
  Button,
  Icon,
  Input,
  Text,
  useMediaQuery,
  useToast
} from "@deckai/deck-ui";
import React, { useCallback, useEffect, useState } from "react";

import { Assets } from "@site";
import { Image } from "@image";
import { CalloutLayout } from "@deckai/client/layout/CalloutLayout";

const apple = Assets.logos.apple;
const facebook = Assets.logos.facebook;
const google = Assets.logos.google;

type SignedInProps = {
  disableButton: boolean;
  handleSubmit?: ({
    email,
    password,
    register
  }: {
    email: string;
    password: string;
    register: boolean;
  }) => Promise<void>;
};

export const SignedOut = ({ handleSubmit, disableButton }: SignedInProps) => {
  const { show } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [register, setRegister] = useState(false);

  const [formData, setFormData] = useState({
    email: "name@email.com",
    password: "thepassword"
  });
  useEffect(() => {
    if (formData.email?.length > 0 && formData.password?.length > 0) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [formData.email, formData.password]);

  const onFormSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        handleSubmit?.({
          email: formData.email,
          password: formData.password,
          register
        });
      } catch (error) {
        console.error("Error during form submission:", error);
        
      } finally {
        setIsSubmitting(false);
      }
    },
    [register, formData, isSubmitting, show]
  );
  const onFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return (
    <>
      <Text variant="heading-md" className="text-center">
        {register ? "Register" : "Sign in"}
      </Text>

      <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={onFormChange}
            placeholder="name@email.com"
            required
          />
          <div className="flex flex-col gap-2">
            <Input
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onFormChange}
              placeholder="Enter your password"
              required
              end={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  <Icon
                    name={showPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="secondary"
                  />
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRememberDevice(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Text variant="body-xs-medium">Remember me</Text>
              </label>
              <button type="button" onClick={() => setRegister(!register)}>
                <Text variant="body-xs-medium" color="primary-100">
                  {register
                    ? "Have an account?"
                    : "Need an account?"}
                </Text>
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4"
          color="black"
          variant="filled"
          disabled={isSubmitting || !canSubmit || disableButton}
        >
          {register ? "Register" : "Sign In"}
        </Button>
      </form>
      <div className="w-full flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <Text variant="body-md" color="secondary">
          OR
        </Text>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex gap-3 flex-wrap justify-center items-center">
        <Button className="px-12" color="secondary" variant="outlined">
          <Image src={google} alt="Google" className="w-6 h-6" />
        </Button>
        <Button className="px-12" color="secondary" variant="outlined">
          <Image src={apple} alt="Apple" className="w-6 h-6" />
        </Button>
        <Button className="px-12" color="secondary" variant="outlined">
          <Image src={facebook} alt="Facebook" className="w-6 h-6" />
        </Button>
      </div>

      <Text variant="body-xxs" color="secondary" className="text-center">
        By continuing, you agree to the {" "}
        <button
          onClick={() => {
            show({
              message: "Terms and Conditions clicked",
              variant: "default"
            });
          }}
        >
          <Text variant="body-xs-medium" color="primary-100">
            Terms and Conditions
          </Text>
        </button>{" "}
        and{" "}
        <button
          onClick={() => {
            show({
              message: "Privacy Policy clicked",
              variant: "default"
            });
          }}
        >
          <Text variant="body-xs-medium" color="primary-100">
            Privacy Policy
          </Text>
        </button>
        . We do not share your personal details.
      </Text>
    </>
  );
};
