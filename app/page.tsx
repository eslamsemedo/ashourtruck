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
        {/* <BestSellers /> */}
        <section className="py-16 px-6 bg-black">
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

            {/* Image on the left */}
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"  // Replace with your actual image
                alt="Car Accessories"
                className="w-full h-auto object-cover rounded-lg shadow-xl transition-transform transform hover:scale-105"
              />
            </div>

            {/* Text on the right */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-semibold text-white mb-4">Upgrade Your Ride with Premium Car Accessories</h2>
              <p className="text-gray-500 text-lg mb-6">
                Transform your car into a powerhouse of comfort, style, and performance with our exclusive collection of car accessories.
                From high-performance sensors to luxury seat covers, we have everything to elevate your driving experience.
                Our products are crafted with the highest quality materials, ensuring durability, functionality, and aesthetic appeal.
                Whether you’re upgrading your car’s interior, enhancing its performance, or adding unique finishing touches, we’ve got you covered.
              </p>
              <a href="#!" className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300">
                Browse Our Collection
              </a>
            </div>

          </div>
        </section>
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
