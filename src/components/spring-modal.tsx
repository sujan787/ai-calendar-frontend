import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentProps,
  FC,
} from "react";

const ModalContext = createContext<{
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
} | null>(null);

interface ModelProps extends ComponentProps<"div"> {
  open?: boolean
}

export const Modal: FC<ModelProps> = ({open=false, className, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </ModalContext.Provider>
  );
};

interface ModalTriggerProps extends ComponentProps<"button"> {}

export const ModalTrigger: FC<ModalTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalTrigger must be used inside Modal");

  return (
    <button
      onClick={() => context.setIsOpen(true)}
      className={cn(" cursor-pointer w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};

interface ModalContentProps extends ComponentProps<"div"> {}

export const ModalContent: FC<ModalContentProps> = ({
  className,
  children,
  ...props
}) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalContent must be used inside Modal");

  if (!context.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => context.setIsOpen(false)}
        className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-hidden cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0, rotate: "12.5deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          exit={{ scale: 0, rotate: "0deg" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
        >
          {children}

          {/* <div className="mt-4 flex justify-end">
            <button
              onClick={() => context.setIsOpen(false)}
              className="cursor-pointer text-white hover:opacity-90 transition-opacity bg-blue-600 shadow shadow-blue-200 hover:bg-blue-700 font-semibold px-4 py-2 rounded"
            >
              Close
            </button>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
