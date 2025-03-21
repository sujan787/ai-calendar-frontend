import { motion } from "framer-motion";
import {
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  useContext,
  useRef,
} from "react";

// 🎯 Context for managing scroll state
interface ScrollContextProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}
const ScrollContext = createContext<ScrollContextProps | null>(null);

// 🎯 Provider Component
interface HorizontalScrollProps extends ComponentProps<"div"> {
  children: ReactNode;
}
export const HorizontalScroll: FC<HorizontalScrollProps> = ({
  children,
  className,
  ...props
}) => {
  const scrollRef = useRef<any>(null);

  return (
    <ScrollContext.Provider value={{ scrollRef }}>
      <div
        ref={scrollRef}
        className={`overflow-x-auto scrollbar-hidden ${className}`}
        {...props}
      >
        <div className="flex space-x-4">{children}</div>
      </div>
    </ScrollContext.Provider>
  );
};

// 🎯 Scroll Item Component
interface ScrollItemProps extends ComponentProps<"div"> {}
export const ScrollItem: FC<ScrollItemProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={`min-w-[200px] p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white ${className}`}
      whileHover={{ scale: 1.05 }}
      //   {...props}
    >
      {children}
    </motion.div>
  );
};
