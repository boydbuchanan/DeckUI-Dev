"use client";
import { useCallback, useMemo, useState } from "react";
import { AboutCard, Button, ContactItemProps, ProfileCard, SocialCard, SocialCardProps, useToast } from "@deckai/deck-ui";

import { SessionData } from "@deckai/client/types/session";
import * as CMS from "@deckai/client/types/cms";
import { NewLayout } from "@deckai/client/layout/NewLayout";

import { loadStripe } from '@stripe/stripe-js';
import { Config } from "@deckai/client";

const Stripe = loadStripe(Config.STRIPE_PUBLIC_KEY);

export function Offer({
    session,
    user,
}: {
    session: SessionData;
    user?: CMS.User;
}) {
    const { show } = useToast();
    const [theUser, setTheUser] = useState(user);

    const handleCheckout = async () => {
        const stripe = await Stripe;
        const response = await fetch('/api/checkout/create', {
            method: 'POST',
        });
        const session = await response.json();
        await stripe?.redirectToCheckout({ sessionId: session.id });
    };

    return (
        <NewLayout user={session.Auth?.user ?? undefined}>
            <div className="mx-auto py-8 w-full">
                <div className="flex flex-col">
                    <div className="flex flex-col justify-between pb-8 gap-10">
                    <h1>Stripe Checkout Example</h1>
                    <p>Click the button below to checkout</p>
                    
                    <Button onClick={handleCheckout}>Checkout</Button>
                    </div>
                </div>
            </div>
        </NewLayout>
    );
}

export default Offer;