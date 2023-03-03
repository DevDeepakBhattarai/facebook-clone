import { motion } from "framer-motion";
import * as React from "react";
import { useSelector } from "react-redux";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { RootState } from "../store";

export interface IHeroProps {}

export function Hero(props: IHeroProps) {
  const [text, helper] = useTypewriter({
    words: ["Hi, the name is Deepak Bhattarai", "<>Coding-Nerd</>"],
    loop: true,
    delaySpeed: 2000,
  });

  const { isLoading } = useSelector((store: RootState) => store.home);
  return (
    <div className="flex-1">
      <motion.div className="isolate lg:h-screen flex text-5xl pointer-events-none overflow-hidden items-center ml-4">
        {!isLoading && (
          <>
            <span
              style={{ WebkitBackgroundClip: "text" }}
              className="h-max text-4xl leading-[4rem] md:leading-[4.5rem] md:text-[2.8rem] font-semibold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
            >
              {text}
              <Cursor cursorColor="blue"></Cursor>
            </span>
          </>
        )}
      </motion.div>
    </div>
  );
}
