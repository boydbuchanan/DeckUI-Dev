import { createRef, useState } from "react";

interface WhenVisibleProps {
  isVisible: () => void;
  isLast: boolean;
  children?: React.ReactNode;
}

export function WhenVisible({ isVisible, isLast, children }: WhenVisibleProps) {
  const [isVisibleState, setIsVisibleState] = useState(false);
  const thisRef = createRef<HTMLDivElement>();

  const observer = new IntersectionObserver(([entry]) => {
    if (isLast && entry.isIntersecting && !isVisibleState) {
      setIsVisibleState(true);
      isVisible();
      observer.unobserve(entry.target);
    }
  });

  if (thisRef?.current) observer.observe(thisRef.current);

  return <div ref={thisRef}>{children}</div>;
}

export default WhenVisible;
