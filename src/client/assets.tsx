// Static imports are removed from front end repo
// import designerImage from "@assets/designer.png";

// Assets reference images in the public folder

export const emailIcon = `<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.6816 16.25C14.9627 16.2563 16.5 14.3822 16.5 12.0788V6.92751C16.5 4.62412 14.9627 2.75 12.6816 2.75H5.31835C3.03734 2.75 1.5 4.62412 1.5 6.92751V12.0788C1.5 14.3822 3.03734 16.2563 5.31835 16.25H12.6816Z" fill="#089CCB" stroke="#089CCB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.426 7.13843L10.0936 9.84821C9.46395 10.3477 8.5781 10.3477 7.94848 9.84821L4.58789 7.13843" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const websiteIcon = `
<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 18.3334C13.1421 18.3334 16.5 14.6024 16.5 10C16.5 5.39765 13.1421 1.66669 9 1.66669C4.85786 1.66669 1.5 5.39765 1.5 10C1.5 14.6024 4.85786 18.3334 9 18.3334Z" fill="#089CCB" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.99995 2.5H6.74995C5.28745 7.36667 5.28745 12.6333 6.74995 17.5H5.99995" fill="#089CCB"/>
<path d="M5.99995 2.5H6.74995C5.28745 7.36667 5.28745 12.6333 6.74995 17.5H5.99995" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 2.5C12.7125 7.36667 12.7125 12.6333 11.25 17.5V2.5Z" fill="#089CCB"/>
<path d="M11.25 2.5C12.7125 7.36667 12.7125 12.6333 11.25 17.5" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 13.3333V12.5C6.63 14.125 11.37 14.125 15.75 12.5V13.3333" fill="#089CCB"/>
<path d="M2.25 13.3333V12.5C6.63 14.125 11.37 14.125 15.75 12.5V13.3333" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 7.5C6.63 5.875 11.37 5.875 15.75 7.5" stroke="#E7F7FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const Assets = {
  images: {
    designer: "/assets/designer.png",
    emailIcon: emailIcon,
    websiteIcon: websiteIcon,
    talentPool: "/assets/talent-pool.jpeg",
    platform: "/assets/platform.png",
    briefs: "/assets/briefs.png",
    creatorHero: "/assets/creator-hero.png",
    buyerHero: "/assets/buyer-hero.png",
    buyerHero2: "/assets/buyer-hero.jpg"
  },
  logos: {
    apple: "/assets/logos/apple.png",
    facebook: "/assets/logos/facebook.png",
    google: "/assets/logos/google.svg",
    instagram: "/assets/logos/instagram.svg",
    instagramBlackWhite: "/assets/logos/instagram-bw.svg",
    tiktok: "/assets/logos/tiktok.svg",
    youtube: "/assets/logos/youtube.svg"
  }
};

export default Assets;
