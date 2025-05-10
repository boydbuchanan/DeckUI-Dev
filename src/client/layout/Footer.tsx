import { Logo, Text } from "@deckai/deck-ui";

export const Footer = () => (
  <footer className="md:pt-16 pt-10 pb-10 px-10">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))] gap-8 md:justify-start justify-center">
      <div className="flex flex-col gap-4">
        <Text variant="body-default-bold">Company</Text>
        <div className="flex flex-col gap-2">
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              About
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Invite a friend
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Blog
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Careers
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Referral Program
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Community
            </Text>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="body-default-bold">Product</Text>
        <div className="flex flex-col gap-2">
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Overview
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Features
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Pricing
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Documentation
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Tools & Integrations
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Release Notes
            </Text>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="body-default-bold">Support</Text>
        <div className="flex flex-col gap-2">
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Help Center
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              FAQ
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Contact
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Press
            </Text>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="body-default-bold">Legal</Text>
        <div className="flex flex-col gap-2">
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Cookies Policy
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Legal Notice
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Privacy Policy
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Terms of Use
            </Text>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="body-default-bold">Social</Text>
        <div className="flex flex-col gap-2">
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Instagram
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Twitter
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              Facebook
            </Text>
          </a>
          <a href="#" className="cursor-pointer">
            <Text variant="body-default" color="secondary">
              LinkedIn
            </Text>
          </a>
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center w-full mt-16">
      <Logo />
      <Text variant="body-xxs" color="secondary">
        © 2024 DECK. All rights reserved.
      </Text>
    </div>
  </footer>
);
