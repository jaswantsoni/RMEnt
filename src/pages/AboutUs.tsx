import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-card/30 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">
                About <span className="text-gradient-gold">Azzaro Home</span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            
            {/* About Azzaro Home */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">
                About Azzaro Home
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Azzaro Home is a family-owned business based in Woodland Hills, California, specializing in premium imported lighting and home décor. We focus on bringing high-quality, design-forward pieces to homeowners, designers, and builders who value craftsmanship and style.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our approach is simple: offer exceptional products at competitive prices, backed by reliable service and a local showroom experience. Whether you're completing a full home project or looking for a single statement piece, we're here to help you find lighting that elevates your space.
              </p>
            </motion.div>

            {/* What We Offer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">
                What We Offer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We specialize in high-end imported lighting and décor pieces designed to bring sophistication and balance into modern homes. Every product in our collection is carefully selected to meet our standards for quality, finish, and design presence.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In addition to our curated collection, we also offer custom lighting solutions tailored to specific project requirements, helping clients bring their exact vision to life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                While we focus on premium pieces, we also believe great design should feel accessible, which is why we regularly offer competitive pricing and exclusive promotions.
              </p>
            </motion.div>

            {/* Who We Work With */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">
                Who We Work With
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Azzaro Home proudly works with homeowners, interior designers, and builders who are looking for lighting that complements high-quality spaces. Whether it's a full home project or a single statement piece, we aim to make the selection process smooth and reliable.
              </p>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">
                Why Choose Us
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Fast and dependable delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Competitive pricing on premium products</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Regular promotional offers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Dedicated in-house customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">A local showroom experience in Woodland Hills</span>
                </li>
              </ul>
            </motion.div>

            {/* Closing Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center py-8 border-t border-border"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're here to help you complete your space with lighting that feels intentional, elegant, and built to stand out.
              </p>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
