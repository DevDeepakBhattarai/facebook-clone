import { animationControls, motion, useAnimation } from "framer-motion";
import React, { ReactElement, useEffect } from "react";
import skills from "../data/Skills.json";
import Title from "./Title";
interface Props {}

export default function Skills({}: Props): ReactElement {
  return (
    <div className="h-screen flex flex-col ">
      <Title firstPart="Ski" secondPart="lls"></Title>
      <div className="h-full flex items-center justify-center p-4">
        <div className="flex flex-row items-center justify-center flex-wrap gap-2 md:gap-4 lg:p-16">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                  delay: index * Math.random() * 0.1,
                },
              }}
              viewport={{ once: true }}
              tabIndex={0}
              className="
            
    h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 group
    rounded-full 
    overflow-hidden
    relative grid place-items-center
    filter hover:grayscale focus:grayscale transition-all duration-100 ease-in-out
    border-[#74A4BC]/50 border-2
    "
            >
              <img
                src={skill.logo}
                className="h-5/6 w-5/6 rounded-full object-contain"
                alt=""
              />
              <div
                className="
            opacity-0 pointer-events-none 
            group-hover:pointer-events-auto group-hover:opacity-100
            group-focus:pointer-events-auto group-focus:opacity-100
            text-xl text-white font-bold flex items-center justify-center
            bg-black/50
            absolute inset-0 transition-opacity duration-100
            "
              >
                {skill.completeness}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
