import { Animation } from "../components/3DAnimation";
import { Hero } from "../components/Hero";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import About from "../components/About";
import CircleAnimation from "../components/CircleAnimation";
import Projects from "../components/Project/Projects";
import Skills from "../components/Skills";
import ContactMe from "../components/ContactMe";
export default function Home() {
  return (
    <>
      <div className="snap-y h-screen overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black scroll-smooth snap-mandatory isolate ">
        <section id="home">
          <Navbar></Navbar>
          <div className="relative isolate h-screen flex snap-center scroll-smooth items-center flex-col lg:flex-row-reverse  overflow-hidden">
            <Animation></Animation>

            <Hero></Hero>

            <Loading />
            <CircleAnimation></CircleAnimation>
          </div>
        </section>

        <section id="about" className="snap-center">
          <About></About>
        </section>

        <section id="projects" className="snap-center">
          <Projects></Projects>
        </section>
        <section id="skills" className="snap-center">
          <Skills></Skills>
        </section>
        <section id="contact me" className="snap-center">
          <ContactMe></ContactMe>
        </section>

        <a href="#home" className="absolute bottom-4 left-4 h-8 w-8">
          <img src="/up.png" alt="" />
        </a>
      </div>
    </>
  );
}
