import { useMediaQuery, WorkCardProps, Text, Pressable, Icon, Carousel, AddWorkCard, WorkCard } from "@deckai/deck-ui";
import { useCallback, useRef, useState } from "react";

// Define the CarouselRef type for our refs
type CarouselRef = {
    scroll: (direction: "left" | "right") => void;
    getScrollState: () => { canScrollLeft: boolean; canScrollRight: boolean };
};

// Component for a single carousel section with its own state
export const CarouselSection = ({
    group,
    workCards,
    canAddWork,
    handleAddWork
  }: {
    group: string;
    workCards: WorkCardProps[];
    canAddWork: boolean;
    handleAddWork: () => void;
  }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const carouselRef = useRef<CarouselRef>(null);
    const [showLeftPaddle, setShowLeftPaddle] = useState(false);
    const [showRightPaddle, setShowRightPaddle] = useState(true);
  
    // Handle scroll state changes from the carousel
    const handleScrollStateChange = useCallback(
      (state: { canScrollLeft: boolean; canScrollRight: boolean }) => {
        setShowLeftPaddle(state.canScrollLeft);
        setShowRightPaddle(state.canScrollRight);
      },
      []
    );
  
    const handleScrollLeft = useCallback(() => {
      if (showLeftPaddle) {
        carouselRef.current?.scroll("left");
      }
    }, [showLeftPaddle]);
  
    const handleScrollRight = useCallback(() => {
      if (showRightPaddle) {
        carouselRef.current?.scroll("right");
      }
    }, [showRightPaddle]);
  
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Text variant="body-md" color="secondary">
            {group} {workCards.length}
          </Text>
  
          {/* External paddle controls - always visible on mobile if there's more than one card */}
          {isMobile && workCards.length > 1 && (
            <div className="flex gap-2">
              <Pressable
                onClick={handleScrollLeft}
                className={`flex items-center justify-center rounded-full shadow-sm transition-colors
                  ${
                    showLeftPaddle
                      ? "active:bg-gray-200"
                      : "bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                disabled={!showLeftPaddle}
              >
                <Icon
                  name="arrow-square-left"
                  size={["md:52", 24]}
                  color={showLeftPaddle ? undefined : "secondary"}
                />
              </Pressable>
              <Pressable
                onClick={handleScrollRight}
                className={`flex items-center justify-center rounded-full shadow-sm transition-colors
                  ${
                    showRightPaddle
                      ? "active:bg-gray-200"
                      : "bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                disabled={!showRightPaddle}
              >
                <Icon
                  name="arrow-square-right"
                  size={["md:52", 24]}
                  color={showRightPaddle ? undefined : "secondary"}
                />
              </Pressable>
            </div>
          )}
        </div>
  
        <Carousel
          ref={carouselRef}
          showPaddles={!isMobile}
          className={`carousel-${group.replace(/\s+/g, "-")}`}
          onScrollStateChange={handleScrollStateChange}
        >
          {canAddWork && <AddWorkCard onClick={handleAddWork} />}
          {workCards.map((workCard, index) => (
            <WorkCard key={`${group}-work-${index}`} {...workCard} />
          ))}
        </Carousel>
      </div>
    );
  };

export default CarouselSection;