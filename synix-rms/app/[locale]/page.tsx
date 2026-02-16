import Navbar from '@/templates/Navbar';
import Hero from '@/templates/Hero';
import Features from '@/templates/Features';
import Pricing from '@/templates/Pricing';
import CTA from '@/templates/CTA';
import FAQ from '@/templates/FAQ';
import Footer from '@/templates/Footer';

export default function LocaleHomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </>
  );
}
