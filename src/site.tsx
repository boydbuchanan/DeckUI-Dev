// site.tsx should contain all site (next) related functions used client side
// it is mocked on front end side to remove next.js dependency

// -- DeckSite Repository

import useSession from "session/use-session";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export { useSession };

// -- End DeckSite Repository

// // -- DeckUI Repository

// import { defaultSession, SessionData } from "./client/types/session";


// mock useSession
// function mockUseSession() {
//     const session = defaultSession;
//     const isLoading = false;
//  const login = async ({
//    email,
//    password
//  }: {
//    email: string;
//    password: string;
//  }) => {
//         console.log("Login");
//         return { isLoggedIn: true } as SessionData;
//     };
//     const logout = async () => {
//         console.log("Logout");
//     };
//     const refresh = async () => {
//         console.log("Refresh");
//     };
//     return { session, logout, login, refresh, isLoading };
// }

// function useRouter() {
//     return {
//         pathname: "/",
//         push: (path: string) => console.log(`Pushing to ${path}`),
//         replace: (path: string) => console.log(`Replacing to ${path}`)
//     };
// }

// export { mockUseSession as useSession };

// // -- End DeckUI Repository

import { Assets } from "./client/assets";

export { Assets };

export const ApiConfig = {
  APIURL: "/api",
  socialProviders: {
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok"
  }
};

export const links = {
  home: "/",
  signIn: "/signin",
  myProfile: "/me",
  explore: "/explore",
  userProfile: (path: string) => `/c/${path}`
};
export interface SiteRouter {
  goToHome: () => void;
  goToMyProfile: () => void;
  goToSignIn: () => void;
  goTo: (path: string) => void;
  userProfile: (path: string) => void;
  explore: (category?: string, interests?: string[], page?: number) => void;
  pathname: string | null;
}

export const useSiteRouter = (): SiteRouter => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const push = (path: string) => {
        console.log(`Pushing to ${path}`);
        router.push(path);
    }
    const replace = (path: string) => {
        console.log(`Replacing to ${path}`);
        router.replace(path);
    }

    return {
        goToHome: () => push(links.home),
        goToMyProfile: () => push(links.myProfile),
        goToSignIn: () => push(links.signIn),
        goTo: (path: string) => push(path),
        explore: (category?: string, interests?: string[], page?: number) => {
            const query = new URLSearchParams(searchParams ?? "");
            if(page)
                query.set("page", page.toString());

            query.delete("i");
            if(interests && interests.length > 0){
                interests.forEach((interest) => query.append("i", interest));
            }
            if(category)
                push(`${links.explore}/${category}?${query.toString()}`);
            else
                push(`${links.explore}?${query.toString()}`);
            
        },
        userProfile: (path: string) => push(links.userProfile(path)),
        
        pathname: pathname,
    };
};