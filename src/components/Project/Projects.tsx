import { motion } from "framer-motion";
import React, { ReactElement, useEffect, useRef } from "react";
import IndividualProject from "./IndividualProject";
import data from "../../data/Projects.json";
import Title from "../Title";
interface Props {}

export default function Projects({}: Props): ReactElement {
  const bouncer = useRef<HTMLDivElement>(null);
  const projects = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen relative isolate flex flex-col overflow-hidden">
      <Title firstPart="Pro" secondPart="jects"></Title>

      <div
        onScroll={() => {
          if (bouncer.current) bouncer.current.style.display = "none";
        }}
        className="flex overflow-x-scroll snap-x flex-1 snap-mandatory w-full scrollbar-thin scrollbar-thumb-[#74A4BC] scrollbar-track-transparent"
      >
        {data.map((project, index) => (
          <div
            key={index}
            className={`${
              index === 0 && "firstProject"
            } relative snap-center overflow-hidden  flex-shrink-0 flex items-center justify-center h-full w-full`}
          >
            <IndividualProject
              title={project.title}
              description={project.description}
              photo={project.photo}
            ></IndividualProject>

            {index === 0 && (
              <motion.div
                ref={bouncer}
                initial={{ opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  transition: { duration: 1, delay: 2 },
                }}
                className="absolute bottom-10 text-5xl"
              >
                <div className="relative animate-bounce items-center flex justify-center rounded-full h-8 w-8">
                  <img
                    src="/up.png"
                    className="absolute -left-1 rotate-90 h-6 w-6 animate-pulse"
                    alt=""
                  />
                  <img
                    src="/up.png"
                    className="absolute rotate-90 h-6 w-6 animate-pulse"
                    alt=""
                  />
                  <img
                    src="/up.png"
                    className="absolute -right-1 rotate-90 h-6 w-6 animate-pulse"
                    alt=""
                  />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ left: "90%" }}
        whileInView={{
          left: "0",
          transition: {
            duration: 1,
            type: "spring",
            damping: 10,
          },
        }}
        className="absolute top-1/2 -z-50 -translate-y-1/2 bg-[#74A4BC] h-1/2 w-full -skew-y-12 xl:-skew-y-[10deg]"
      ></motion.div>
    </div>
  );
}
