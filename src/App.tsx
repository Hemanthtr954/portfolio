import Hero from "./components/Hero";
import Cases from "./components/Cases";
import Craft from "./components/Craft";
import HireMe from "./components/HireMe";
import { profile } from "./config";

export default function App() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <Hero />
      <main>
        <Cases />
        <Craft />
        <HireMe />
      </main>
      <footer className="foot mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a> · <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
      </footer>
    </>
  );
}
