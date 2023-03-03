import { motion } from "framer-motion";
import React, { ReactElement, useRef } from "react";
import Title from "./Title";

interface Props {}
interface SocialsProps {
  platform: string;
  link: string;
  index: number;
}
const socialsList = [
  {
    platform: "twitter",
    link: "/twitter.png",
  },
  {
    platform: "facebook",
    link: "/facebook.png",
  },
  {
    platform: "youtube",
    link: "/youtube.png",
  },
  {
    platform: "instagram",
    link: "/ig.png",
  },
];
function Socials({ platform, link, index }: SocialsProps) {
  return (
    <motion.div
      initial={{ y: "-90%" }}
      whileInView={{
        y: 0,

        transition: {
          duration: 1,
          delay: index * 0.1,
        },
      }}
      tabIndex={0}
      className="socials"
    >
      <span className="sr-only">Follow me on {platform}</span>
      <img src={link} className="h-5/6 w-5/6 object-cover" alt="" />
    </motion.div>
  );
}

export default function ContactMe({}: Props): ReactElement {
  const query = useRef<HTMLInputElement>(null);
  const hiring = useRef<HTMLInputElement>(null);
  const debug = useRef<HTMLInputElement>(null);
  return (
    <div className="h-screen relative overflow-hidden isolate">
      <Title firstPart="Contact " secondPart="Me" color="white"></Title>

      <div className="h-full flex flex-row-reverse justify-center lg:justify-start items-end pt-10 pb-20 ">
        <div className="bg-white  h-full w-96 shadow-2xl lg:mr-32 shadow-white/50  overflow-y-scroll scrollbar-none">
          <div className="font-bold text-lg text-center mt-2">Contact Me</div>

          <div className="space-y-4 p-4 ">
            <div>
              <input
                type="text"
                id="text"
                placeholder="Username"
                className="p-2 rounded-lg placeholder:tracking-widest placeholder:font-bold focus:outline-blue-500 w-full bg-gray-300"
              />
            </div>
            <div>
              <input
                type="text"
                id="email"
                placeholder="Email"
                className="p-2 rounded-lg placeholder:tracking-widest placeholder:font-bold focus:outline-blue-500 w-full bg-gray-300"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                maxLength={300}
                cols={80}
                className="p-2 rounded-lg h-40  placeholder:tracking-widest placeholder:font-bold focus:outline-blue-500 w-full bg-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <label
                onKeyDown={(e) => {
                  if (e.key == "Enter" || e.key == "Space")
                    hiring.current?.click();
                }}
                tabIndex={0}
                htmlFor="hiring"
                className="flex-1 flex  border- items-center justify-center gap-2 text-lg border-gray-500 border rounded-md"
              >
                <label htmlFor="hiring">Hire</label>
                <input
                  tabIndex={-1}
                  ref={hiring}
                  type="radio"
                  name="reason"
                  id="hiring"
                />
              </label>

              <label
                onKeyDown={(e) => {
                  if (e.key == "Enter" || e.key == "Space")
                    query.current?.click();
                }}
                tabIndex={0}
                htmlFor="query"
                className="flex-1 flex items-center justify-center gap-2 text-lg border-gray-500 border rounded-md"
              >
                <label htmlFor="query">Query</label>
                <input
                  tabIndex={-1}
                  ref={query}
                  type="radio"
                  name="reason"
                  id="query"
                />
              </label>

              <label
                onKeyDown={(e) => {
                  if (e.key == "Enter" || e.key == "Space")
                    debug.current?.click();
                }}
                tabIndex={0}
                htmlFor="debug"
                className="flex-1 flex items-center justify-center gap-2 text-lg border-gray-500 border rounded-md"
              >
                <label htmlFor="debug">Debug</label>
                <input
                  tabIndex={-1}
                  ref={debug}
                  type="radio"
                  name="reason"
                  id="debug"
                />
              </label>
            </div>
            <div className="h-10">
              <button
                type="submit"
                className="h-full w-full rounded-lg bg-[length:200%] hover:bg-right transition-all duration-200 bg-gradient-to-r from-blue-500 via-purple-400 to-purple-600"
              >
                Submit
              </button>
              <div
                className="relative isolate mt-6 text-center text-3xl 
              before:content-[open-quote]  before:text-5xl before:font-serif before:text-blue-300 before:-z-50
              after:content-[close-quote] after:text-5xl after:text-blue-300 after:font-serif after:-z-50
              
              "
              >
                Have a nice day
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 h-full w-24 md:w-32 flex flex-col justify-center items-center gap-4  scale-105 ring ring-inset ring-red-100">
          {socialsList.map((socials, index) => (
            <Socials
              key={index}
              platform={socials.platform}
              link={socials.link}
              index={index}
            />
          ))}
        </div>

        <motion.img
          initial={{ scale: 1.5 }}
          whileInView={{ scale: 1, transition: { duration: 1 } }}
          viewport={{ once: true }}
          src="/bg.jpg"
          className="object-cover overflow-hidden h-screen w-screen object-center absolute -z-50 inset-0"
          alt=""
        />
      </div>
    </div>
  );
}
