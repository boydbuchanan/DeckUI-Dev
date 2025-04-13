import { Icon, Text } from "@deckai/deck-ui";
import type { IconName } from "@deckai/icons";

export type TileProps = {
  title: string;
  iconName: IconName;
  onClick?: () => void;
};

const Tile = (tile: TileProps) => (
  <div
    className="lg:h-[130px] lg:w-[226px] h-28 w-28 lg:py-4 lg:px-11 p-4 flex flex-col justify-center items-center cursor-pointer bg-background-100 gap-4 rounded-lg"
    onClick={tile.onClick}
  >
    <Text
      className="text-center break-word"
      variant={["lg:body-md", "body-xxs-medium"]}
    >
      {tile.title}
    </Text>
    <Icon name={tile.iconName ?? "image"} size={["lg:60", 32]} />
  </div>
);

export type TileGridProps = {
  tiles: TileProps[];
  getKey?: (tile: TileProps) => string;
};

export const TileGrid = ({ tiles, getKey }: TileGridProps) => {
  return (
    <div key='tilegrid' className="flex flex-wrap md:gap-6 gap-2 justify-center">
      {tiles.map((tile) => (
        <Tile
          key={getKey ? getKey(tile) : tile.title}
          title={tile.title}
          iconName={tile.iconName}
          onClick={tile.onClick}
        />
      ))}
    </div>
  );
};
