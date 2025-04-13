import "@deckai/deck-ui/styles/styles.css";
import "styles/globals.css";

import * as React from "react";

import localFont from "next/font/local";
import { ToastProvider } from "@deckai/deck-ui";


export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${gilroy.variable} antialiased`}>
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </head>
            <body>                
                <ToastProvider>
                    {props.children}
                </ToastProvider>
            </body>
        </html>
    );
}
const gilroy = localFont({
    src: [
        {
        path: "../public/fonts/GilroyLight.ttf",
        weight: "400",
        style: "normal",
        },
        {
        path: "../public/fonts/GilroyRegular.ttf",
        weight: "500",
        style: "normal",
        },
        {
        path: "../public/fonts/GilroyMedium.ttf",
        weight: "600",
        style: "normal",
        },
        {
        path: "../public/fonts/GilroyBold.ttf",
        weight: "700",
        style: "normal",
        },
    ],
    variable: "--font-gilroy",
});
