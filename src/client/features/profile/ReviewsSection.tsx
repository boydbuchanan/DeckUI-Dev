import type { ReviewCardProps } from "@deckai/deck-ui";
import {
  cn,
  Combobox,
  Icon,
  Modal,
  Pressable,
  Rating,
  ReviewCard,
  Text
} from "@deckai/deck-ui";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
const ReviewsWrapper = ({
  reviews,
  getKey,
  averageReview,
  className,
  footer,
  maxReviews,
  right
}: {
  reviews?: ReviewCardProps[];
  getKey?: (review: ReviewCardProps) => string;
  averageReview: number;
  className?: string;
  footer?: ReactNode;
  maxReviews?: number;
  right?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-background-100 rounded-3xl md:p-10 p-6 flex flex-col",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <Text variant={["lg:heading-lg", "md:heading-md", "heading-sm"]}>
          My Reviews
        </Text>
        {reviews && reviews.length > 0 && (
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <Rating rating={averageReview} />
              <Text
                color="secondary"
                variant={["lg:body-lg-semibold", "md:body-default", "body-xs"]}
              >
                ({reviews?.length} reviews)
              </Text>
            </div>
            {right}
          </div>
        )}
      </div>
      <div className="h-[1px] bg-secondary-50 w-full my-6" />
      {reviews && reviews.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 grid-cols-1">
          {reviews.slice(0, maxReviews).map((review) => (
            <ReviewCard key={getKey?.(review) || review.userName} {...review} />
          ))}
        </div>
      ) : (
        <Text variant="body-default-medium" color="secondary">
          No reviews yet
        </Text>
      )}
      {footer}
    </div>
  );
};

export const ReviewsSection = ({
  reviews: reviewsProp,
  className
}: {
  reviews?: ReviewCardProps[];
  className?: string;
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState(reviewsProp);
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  const handleSortChange = useCallback(
    (value: string) => {
      if (value === "latest") {
        setReviews(
          reviewsProp?.sort((a, b) => b.date.getTime() - a.date.getTime())
        );
      } else {
        setReviews(
          reviewsProp?.sort((a, b) => a.date.getTime() - b.date.getTime())
        );
      }
    },
    [reviewsProp]
  );
  return (
    <>
      <ReviewsWrapper
        className={className}
        reviews={reviews}
        averageReview={averageReview}
        maxReviews={2}
        footer={
          reviews &&
          reviews.length > 2 && (
            <Pressable onClick={() => setShowAllReviews(true)} className="mt-6">
              <Text
                variant="body-default-medium"
                className="underline text-center"
                color="secondary"
              >
                Show all reviews
              </Text>
            </Pressable>
          )
        }
      />
      <Modal
        open={showAllReviews}
        onClose={() => setShowAllReviews(false)}
        closeButtonClassName="top-10 right-10"
        closeButtonSize={24}
      >
        <ReviewsWrapper
          reviews={reviews}
          averageReview={averageReview}
          maxReviews={reviews?.length}
          right={
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <Icon name="filter" />
                <Text className="min-w-14" variant="body-default">
                  Sort By
                </Text>
              </div>
              <Combobox
                options={[
                  { label: "Most Recent", value: "latest" },
                  { label: "Oldest", value: "oldest" }
                ]}
                onSelected={handleSortChange}
                placeholder="Most Recent"
                end={<Icon size={16} name="arrow-down" />}
              />
            </div>
          }
        />
      </Modal>
    </>
  );
};
