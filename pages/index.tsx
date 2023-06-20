import {useTransformBridge} from "#/core/context/transform-bridge-context";
import {AnimatePresence, motion} from "framer-motion";
import {Inter} from "next/font/google";
import {useEffect, useRef} from "react";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
  const transformBridge = useTransformBridge();
  const placeholderRef = useRef<HTMLDivElement>(null);

  return (
    <main className={`${inter.className}`} style={{background: "black"}}>
      {/* <AnimatePresence>
        {transformBridge.selected && (
          <motion.div layoutId={transformBridge.selected}>
            <motion.img {...transformBridge.props} />
          </motion.div>
        )}
      </AnimatePresence> */}
    </main>
  );
}
