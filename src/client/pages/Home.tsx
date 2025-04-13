"use client";

import {
  Button,
  Carousel,
  cn,
  CreatorCard,
  Icon,
  Pressable,
  Text,
  useMediaQuery
} from "@deckai/deck-ui";
import type { CarouselRef } from "@deckai/deck-ui/components/Carousel";
import { useMemo, useRef, useState } from "react";
import { Image } from "@image";

import { TileGrid, TileProps } from "@deckai/client/features/home/TileGrid";
import { Hero } from "@deckai/client/features/home/Hero";
import { Footer } from "@deckai/client/layout/Footer";
import { NewLayout } from "@deckai/client/layout/NewLayout";
import type { SessionData } from "@deckai/client/types/session";
import { Assets, useSiteRouter } from "@site";
import { Category, User } from "@deckai/client/types/cms";
import Creators from "../features/search/Creators";

const theDifferenceContent: {
  title: string;
  description: string;
  image: string;
}[] = [
  {
    title: "Diverse Talent Pool",
    description:
      "Discover creators specializing in music, cooking, sports, tech, and more.",
    image: Assets.images.talentPool
  },
  {
    title: "All-in-One Platform",
    description:
      "Browse portfolios, message creators, book appointments, and manage projects seamlessly.",
    image: Assets.images.platform
  },
  {
    title: "Detailed Project Briefs",
    description:
      "Clearly outline your vision and requirements for successful collaborations.",
    image: Assets.images.briefs
  }
];

export default function Home({
  session,
  categories
}: {
  session: SessionData;
  categories: Category[];
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const carouselRef = useRef<CarouselRef>(null);
  const [totalResults, setTotalResults] = useState(0);

  const Router = useSiteRouter();

  const categoryTiles = useMemo(() => {
    return categories.map((category) => {
      return {
        title: category.Display,
        iconName: category.IconName,
        onClick: () => Router.explore(category.Url, [], 0),
      } as TileProps;
    });
  }, [categories]);

  return (
    <NewLayout
      user={session.Auth?.user ?? undefined}
      showBreadcrumbs={false}
      contentClassName="!px-0 pt-0"
      className="bg-background-0"
    >
      <Hero />
      <div className="flex flex-col  md:mt-16 mt-10">
        <div className="flex flex-col md:gap-8 gap-4 md:px-10 px-4">
          <Text variant={["md:heading-lg", "body-md"]}>
            What do you need content for?
          </Text>
          <TileGrid tiles={categoryTiles} />
        </div>
        <div className="flex flex-col md:gap-3 gap-1 md:px-10 px-4 relative md:mt-16 mt-10">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <Text variant={["md:heading-lg", "body-md"]}>
                Join the growing list of DECK creators...
              </Text>
              {totalResults > 0 && (
                <Text variant={["body-lg-semibold", "body-xs-medium"]}>
                  {totalResults} creators
                </Text>
              )}
            </div>
            <div className={cn("flex", isMobile ? "gap-2" : "gap-4")}>
              <Pressable onClick={() => carouselRef.current?.scroll("left")}>
                <Icon name="arrow-square-left" size={["md:52", 24]} />
              </Pressable>
              <Pressable onClick={() => carouselRef.current?.scroll("right")}>
                <Icon name="arrow-square-right" size={["md:52", 24]} />
              </Pressable>
            </div>
          </div>
          <Carousel
            minHeight={isMobile ? "400px" : "520px"}
            gap={isMobile ? 8 : 16}
            ref={carouselRef}
          >
            <Creators 
              category={undefined}
              interests={[]} 
              currentPage={0}
              className="snap-start shrink-0 m-2"
              onSearch={(total) => {
                setTotalResults(total);
              }}
            />
          </Carousel>
          <Text
            variant="body-default-bold"
            color="secondary"
            className="absolute bottom-8 inset-x-0 text-center underline cursor-pointer"
            onClick={() => Router.goTo("/explore")}
          >
            See More
          </Text>
        </div>
        <div className="flex flex-col md:gap-10 gap-6 md:p-12 p-6 bg-background-100">
          <div className="flex flex-col gap-2">
            <Text
              variant="body-xxs-bold"
              color="primary-blue"
              className="uppercase"
            >
              Ready, set, ship
            </Text>
            <Text variant={["md:heading-lg", "body-md"]}>
              Setting up your profile
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {theDifferenceContent.map(({ title, description, image }) => (
              <div key={title} className="flex flex-col gap-5">
                <Image
                  src={image}
                  alt={title}
                  className="h-[216px] w-full object-cover object-center rounded-lg"
                />
                <div className="flex flex-col gap-2">
                  <Text variant={["md:heading-sm", "body-md"]}>{title}</Text>
                  <Text variant="body-default">{description}</Text>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="max-w-[327px] self-center py-4 px-10"
            variant="filled"
            onClick={() => Router.goToSignIn()}
          >
            Become a Creator
          </Button>
        </div>
      </div>
      <Footer />
    </NewLayout>
  );
}
