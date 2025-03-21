import { motion } from "framer-motion";
import {
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  useContext,
  useRef,
} from "react";

// 🎯 Context for managing vertical scroll
interface ScrollContextProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}
const ScrollContext = createContext<ScrollContextProps | null>(null);

// 🎯 Provider Component
interface VerticalScrollProps extends ComponentProps<"div"> {
  children: ReactNode;
  height?: string; // Customizable height
}
export const VerticalScroll: FC<VerticalScrollProps> = ({
  children,
  height = "400px",
  className,
  ...props
}) => {
  const scrollRef = useRef<any>(null);

  return (
    <ScrollContext.Provider value={{ scrollRef }}>
      <div
        ref={scrollRef}
        className={`overflow-y-auto scrollbar-hidden ${className}`}
        style={{ height }}
        {...props}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

// 🎯 Scroll Item Component
interface ScrollItemProps extends ComponentProps<"div"> {}
export const VerticalScrollItem: FC<ScrollItemProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={`w-full p-4 rounded-lg bg-gradient-to-br from-blue-500 to-teal-600 text-white ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  );
};
