import { motion } from "framer-motion";
import React, { ReactElement } from "react";

interface Props {
  firstPart: string;
  secondPart: string;
  color?: string;
}

export default function Title({
  firstPart,
  secondPart,
  color = "black",
}: Props): ReactElement {
  return (
    <motion.div
      className={`pt-2 w-full flex items-center whitespace-pre justify-center text-center tracking-[15px] md:tracking-[22px] font-mono uppercase text-4xl  md:text-5xl text-${color}`}
    >
      <motion.div
        viewport={{ once: true }}
        initial={{ x: "-90%" }}
        whileInView={{
          x: 0,
          transition: {
            duration: 1,
          },
        }}
      >
        {firstPart}
      </motion.div>
      <motion.div
        viewport={{ once: true }}
        initial={{ x: "90%" }}
        whileInView={{
          x: 0,
          transition: {
            duration: 1,
          },
        }}
      >
        {secondPart}
      </motion.div>
    </motion.div>
  );
}
