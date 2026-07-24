import { useState, lazy, Suspense } from "react";
import Preloader from "./components/Preloader";
import CursorGlow from "./components/CursorGlow";
import ErrorBoundary from "./components/ErrorBoundary";

const Scene3D = lazy(() => import("./components/Scene3D"));
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Certifications from "./components/Certifications";
import Skills from "./components/Skills";
import Leadership from "./components/Leadership";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Preloader
          onDone={() => {
            setLoading(false);
            window.dispatchEvent(new Event("preloader-done"));
          }}
        />
      )}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </ErrorBoundary>
      <CursorGlow />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Certifications />
        <Skills />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
