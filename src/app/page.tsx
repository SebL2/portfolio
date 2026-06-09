import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Overview } from "@/components/sections/overview";
import { Projects } from "@/components/sections/projects";
import { TechStack } from "@/components/sections/tech-stack";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { ClimbBackground } from "@/components/climb3d/climb-background";

export default function Home() {
  return (
    <>
      <ClimbBackground />
      <main className="relative w-full overflow-x-hidden">
        <Navbar />
        <Hero />
        <Overview />
        <Projects />
        <TechStack />
        <About />
        <Contact />
      </main>
    </>
  );
}
