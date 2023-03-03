import { motion } from "framer-motion";
import React, { ReactElement } from "react";

interface Props {}

export default function CircleAnimation({}: Props): ReactElement {
  return (
    <>
      <div className="absolute h-screen w-screen -z-10  flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            scale: 2.5,
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="h-96 md:h-screen aspect-square rounded-full  border border-gray-500/50"
        />
      </div>

      <div className="absolute h-screen  w-screen origin-center -z-10  flex items-center justify-center overflow-hidden">
        <div className="h-96 md:h-screen aspect-square rounded-full animate-[ping_20s_infinite_2s_alternate]  border border-gray-500/50" />
      </div>
    </>
  );
}
