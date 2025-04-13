import { Text, Button } from "@deckai/deck-ui";
import { Assets } from "@site";
import { Image } from "@image";

const designerImage = Assets.images.designer;

export function CreatorCallout({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-secondary-400 w-full h-full rounded-lg py-4 px-10 flex flex-col gap-2 items-center">
      <Image
        src={designerImage}
        alt="Deck Creator"
        className="w-[150px] h-[150px]"
      />
      <Text variant="body-default-medium">
        Establish your Creator profile today and begin offering your expert
        services to a diverse range of clients. Showcase your skills,
        experience, and unique offerings by posting your creative work to
        potential clients.
      </Text>
      <Button
        variant="filled"
        color="accent"
        className="mt-6"
        onClick={onClick}
      >
        Build Creator Profile
      </Button>
    </div>
  );
}
