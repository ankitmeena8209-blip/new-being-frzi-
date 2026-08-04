import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import About from "@/components/About";
import ConnectStrip from "@/components/ConnectStrip";
import ConnectRail from "@/components/ConnectRail";
import ScrollRail from "@/components/ScrollRail";
import Footer from "@/components/Footer";
import { getSocialLinks } from "@/lib/socials";

export default function Home() {
  const links = getSocialLinks();

  return (
    <main className="relative">
      <Header />
      <ConnectRail links={links} />
      <ScrollRail />

      <Hero />
      <Stack />
      <About />
      <ConnectStrip links={links} />

      <Footer />
    </main>
  );
}
