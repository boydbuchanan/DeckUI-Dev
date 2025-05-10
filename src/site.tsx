// site.tsx should contain all site (next) related functions used client side
// it is mocked on front end side to remove next.js dependency

// -- DeckSite Repository

import useSession from "session/use-session";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export { useSession };

// -- End DeckSite Repository

// // -- DeckUI Repository

// import { defaultSession, SessionData } from "@deckai/client/types/session";


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

import { Assets } from "@deckai/client/assets";
import { ServerConfig } from "@server/config";
import { Offer, Order, User } from "@deckai/client/types/cms";

export { Assets };

export const ApiConfig = {
  APIURL: "/api",
  socialProviders: {
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok"
  }
};


export interface SiteRouter {
  goToHome: () => void;
  me: () => void;
  goToMyProfile: () => void;
  goToSignIn: () => void;
  goTo: (path: string) => void;
  
  userProfile: (path: string) => void;
  userProfilePath: (user: User) => void;
  offer: (offer: Offer) => void;
  order: (offer: Order) => void;
  myOffers: () => void;
  myOrders: () => void;
  creator: () => void;
  creatorOffers: (creator: User) => void;
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
  const links = ServerConfig.links;

  return {
    goToHome: () => push(links.home),
    me: () => push(links.me),
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
    userProfilePath: (user: User) => push(links.userProfilePath(user)),
    creator: () => push(links.creator),
    creatorOffers: (creator: User) => push(links.creatorOffers(creator)),
    offer: (offer: Offer) => push(links.creatorOffer(offer)),
    order: (order: Order) => push(links.myOrder(order)),
    myOffers: () => push(links.offers),
    myOrders: () => push(links.orders),
    
    pathname: pathname,
  };
};