import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { closeMobileNavBar, openMobileNavBar } from "../state/homeSlice";

type Props = {};

export default function Navbar({}: Props) {
  const navList = useRef<HTMLUListElement>(null);
  const overLay = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const controls = useAnimation();
  const navListControls = useAnimation();
  const { isMobileNavBarOpen } = useSelector((store: RootState) => store.home);
  const menu = useMemo(() => {
    return ["Home", "About", "Projects", "Skills", "Contact Me"];
  }, []);
  useEffect(() => {
    controls.start((li) => {
      return {
        translateY: "0",
        transition: {
          duration: 1,
          delay: li * 0.15,
        },
      };
    });
  }, []);

  return (
    <motion.div
      initial={{
        translateY: "-150%",
      }}
      animate={{
        translateY: "0",
        transition: {
          duration: 1,
        },
      }}
      className=" flex z-50 md:flex-row sticky top-2 items-center justify-between rounded-lg w-full px-4 md:px-20 lg:px-40"
    >
      <motion.div whileTap={{ scale: 0.9 }}>
        <div className="h-16  w-16 md:h-24 md:w-24  rounded-full overflow-hidden grid place-items-center">
          <img src="/logo.png" alt="" />
        </div>
      </motion.div>

      <motion.div
        ref={overLay}
        custom={2}
        animate={navListControls}
        className="hidden absolute h-screen w-screen top-0 left-0 bg-black/20"
      />

      <motion.ul
        ref={navList}
        custom={1}
        initial={{
          translateY: 0,
        }}
        animate={navListControls}
        className="
        hidden flex-col items-center w-full justify-center absolute z-20 py-4 -top-2 left-0 gap-4 text-2xl bg-blue-200
        md:flex md:flex-row md:bg-transparent md:text-lg md:py-0 md:static md:w-auto md:gap-12
        "
      >
        {menu.map((navItem, index) => (
          <motion.li
            key={index}
            onClick={closeNavBar}
            animate={controls}
            initial={{
              translateY: "-100%",
            }}
            custom={index + 1}
            whileHover={{ scale: 1.1 }}
            className="navbarIcons"
          >
            <a href={`#${navItem.toLowerCase()}`}>{navItem}</a>
          </motion.li>
        ))}
        <div
          onClick={closeNavBar}
          className="absolute h-10 w-10 flex items-center justify-center bg-gray-300 rounded-full md:hidden -bottom-20 border border-black 
        animate-[bounce_3s_infinite]
        "
        >
          <img src="/cross.png" className="h-5/6 w-5/6" alt="" />
        </div>
      </motion.ul>

      <div className="block md:hidden" onClick={openNavBar}>
        <div className="flex w-full items-center justify-center">
          <div className="group flex h-20 w-20 cursor-pointer items-center justify-center rounded-3xl p-2">
            <div className="space-y-2">
              <span className="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
              <span className="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  async function openNavBar() {
    navList.current?.classList.replace("hidden", "flex");
    navListControls.set((it) => {
      if (it === 1)
        return {
          translateY: "-100%",
        };
      else return {};
    });
    overLay.current?.classList.replace("hidden", "flex");

    await navListControls.start((it) => {
      if (it === 1) {
        return {
          translateY: 0,
          transition: {
            duration: 2,
            type: "spring",
          },
        };
      } else
        return {
          opacity: 1,
          transition: {
            duration: 1.5,
          },
        };
    });
    document.addEventListener(
      "click",
      async (e) => {
        if (navList.current && !navList.current.contains(e.target as Node)) {
          await navListControls.start((it) => {
            if (it === 1) {
              return {
                translateY: "-100%",
                transition: {
                  duration: 1,
                },
              };
            } else
              return {
                opacity: 0,
                transition: {
                  duration: 1,
                },
              };
          });

          navList.current?.classList.replace("flex", "hidden");
          overLay.current?.classList.replace("flex", "hidden");
          navListControls.set({
            translateY: 0,
          });
        }
      },
      { once: true }
    );
    dispatch(openMobileNavBar());
  }

  async function closeNavBar() {
    if (isMobileNavBarOpen) {
      await navListControls.start((it) => {
        if (it === 1) {
          return {
            translateY: "-150%",
            transition: {
              duration: 1,
            },
          };
        } else
          return {
            opacity: 0,
            transition: {
              duration: 1.5,
            },
          };
      });

      navList.current?.classList.replace("flex", "hidden");
      overLay.current?.classList.replace("flex", "hidden");
      dispatch(closeMobileNavBar());
      navListControls.set({
        translateY: 0,
      });
    }
  }
}
