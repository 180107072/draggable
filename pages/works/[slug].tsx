import {useTransformBridge} from "#/core/context/transform-bridge-context";
import {AnimatePresence, motion} from "framer-motion";
import {useRef} from "react";

const Work = () => {
  const transformBridge = useTransformBridge();

  return (
    <AnimatePresence>
      {transformBridge.selected ? (
        <picture>
          <source src={transformBridge.props?.src} media="(max-width: 767px)" />

          <motion.div layoutId={transformBridge.selected}>
            <motion.img {...transformBridge.props} />
          </motion.div>
        </picture>
      ) : null}
    </AnimatePresence>
  );
};

export default Work;
