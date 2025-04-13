import { Text, Button } from "@deckai/deck-ui";
import { Assets } from "@site";
import { Image } from "@image";

const designerImage = Assets.images.designer;

export function BuyerCallout({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-secondary-400 w-full h-full rounded-lg py-4 px-10 flex flex-col gap-2 items-center">
      <Image
        src={designerImage}
        alt="Deck Creator"
        className="w-[150px] h-[150px]"
      />
      <Text variant="body-default-medium">
        This creator has been verified. You can trust they will deliver high quality content
        and services. You can purchase their services with confidence.
      </Text>
      <Button
        variant="filled"
        color="accent"
        className="mt-6"
        onClick={onClick}
      >
        View Offers
      </Button>
    </div>
  );
}
