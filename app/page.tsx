import Image from "next/image";
// import Hero from '../components/hero';
import TopCategory from "@/components/category";
import BenefitsStrip from "@/components/whyUs";
import Footer from "@/components/footer";
import PromotionsGrid from "@/components/shopNow";
import Header from "@/components/header";

import Cart from "@/components/cart";
import Hero from "@/components/hero2";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestSellers from "@/components/BestSellers";
import TrustSupport from "@/components/TrustSupport";
import BlogNews from "@/components/BlogNews";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {

  return (
    <>
      {/* <Cart /> */}
      {/* 
      <Hero />
      <TopCategory />
      <BenefitsStrip />
      <PromotionsGrid />
       */}
      <Hero />
      <div id="featured-categories">

        <FeaturedCategories />
      </div>

      <div id="best-sellers">
        <BestSellers />
      </div>
      <div id="trust-support">
        <TrustSupport />
      </div>
      <div id="blog-news">
        <BlogNews />
      </div>
      <div id="newsletter-signup">
        <NewsletterSignup />
      </div>
      <div id="footer">

        <Footer />
      </div>
    </>
  );
}
