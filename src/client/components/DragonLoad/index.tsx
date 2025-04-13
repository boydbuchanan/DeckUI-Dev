import WhenVisible from "@deckai/client/components/WhenVisible";
import { Component, createRef, JSX, useState } from "react";

interface DragonLoadState {
  reload: boolean;
  count: number;
}

interface DragonLoadProps<T, T2> {
  whenLastVisible: (page: number) => void;
  collection: T[];
  getKey: (item: T) => string | number;
  Wrap?: React.ComponentType<any> | keyof JSX.IntrinsicElements;
  Template: React.ComponentType<{ item: T; editable?: boolean; props: T2 }>;
  templateProps: T2;
}

const DragonLoad = <T, T2>({
  whenLastVisible,
  collection,
  getKey,
  Wrap = "div",
  Template,
  templateProps
}: DragonLoadProps<T, T2>) => {
  const [count, setCount] = useState(1);

  const handleLastVisible = () => {
    const newCount = count + 1;
    setCount(newCount);
    whenLastVisible(newCount);
  };

  const Wrapper = Wrap;

  return (
    <Wrapper>
      {collection.map((item) => (
        <Template key={getKey(item)} item={item} props={templateProps} />
      ))}
      <WhenVisible
        key={collection.length}
        isLast={true}
        isVisible={handleLastVisible}
      />
    </Wrapper>
  );
};


export default DragonLoad;
