import {useRef, useEffect, FC, PropsWithChildren, useId} from "react";
import {Entry} from "../webgl/entry";
import {motion, useAnimationControls} from "framer-motion";
import {TransformBridgeProvider, useTransformBridge} from "../context/transform-bridge-context";
import css from "./layout.module.scss";
import Link from "next/link";

const FluidImage: FC<{src: string}> = ({src}) => {
  const animationControls = useAnimationControls();
  const transformBridge = useTransformBridge();
  const id = useId();

  return (
    <Link href={`/works/1`}>
      <motion.button
        className="archive-link z-50"
        animate={animationControls}
        initial={{opacity: 0}}
        onClick={(e) => {
          animationControls.set({
            opacity: 1,
            zIndex: 10,
          });

          transformBridge.setSelected(id, {src, width: "440", height: "680"});
        }}
      >
        <picture>
          <source src={src} media="(max-width: 767px)" />

          <motion.div layoutId={id}>
            <motion.img src={src} width="440" height="680" />
          </motion.div>
        </picture>
      </motion.button>
    </Link>
  );
};

export const Wrapper = () => {
  const wrapperRef = useRef<HTMLUListElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<Entry<HTMLUListElement, HTMLDivElement, HTMLLIElement[]> | null>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    if (!wrapperRef.current || !canvasRef.current || entryRef.current) return;

    entryRef.current = new Entry({
      wrapper: wrapperRef.current,
      canvas: canvasRef.current,
      items: itemsRef.current,
    });
  }, []);

  return (
    <div style={{position: "absolute", left: 0, top: 0}}>
      <ul ref={wrapperRef} className={css.layoutGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((k, i) => (
          <li key={k} ref={(ref) => ref && (itemsRef.current[i] = ref)} data-pcimg="https://picsum.photos/200/301">
            <FluidImage src="https://picsum.photos/200/301" />
          </li>
        ))}
      </ul>
      <div ref={canvasRef} className={css.layoutCanvas}></div>
    </div>
  );
};

export const Layout: FC<PropsWithChildren> = ({children}) => {
  return <div className={css.layoutChildren}>{children}</div>;
};
