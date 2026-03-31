import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { ReplacementParts } from "@/components/home/ReplacementParts";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ProductsPreview />
      <ReplacementParts />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Index;
