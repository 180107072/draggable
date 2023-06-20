import { HTMLMotionProps } from "framer-motion";
import {FC, HTMLProps, PropsWithChildren, createContext, useContext, useState} from "react";

interface TransformBridge {
  selected: string | null;
  props: HTMLMotionProps<"img"> | null;
}

type TransformBridgeActions = {
  setSelected: (selected: string | null, props: HTMLMotionProps<"img"> | null) => void;
};

export const TransformBridgeContext = createContext<(TransformBridge & TransformBridgeActions) | null>(null);

export const TransformBridgeProvider: FC<PropsWithChildren> = ({children}) => {
  const [state, setState] = useState<TransformBridge>({
    selected: null,
    props: null,
  });

  const setSelected = (selected: string | null, props: HTMLMotionProps<"img"> | null) => setState(() => ({selected, props}));

  return <TransformBridgeContext.Provider value={{...state, setSelected}}>{children}</TransformBridgeContext.Provider>;
};

export const useTransformBridge = () => {
  const context = useContext(TransformBridgeContext);

  if (!context) throw Error("No context provider");

  return context;
};
