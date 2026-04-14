import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle, Gem, Shirt, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-card/30 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Story</p>
              <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                About <span className="text-gradient-gold">RMP Jewels & Women Clothing</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Where timeless jewellery meets curated women's fashion — crafted for the woman who values elegance in every detail.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-14">

            {/* Who We Are */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-5">Who We Are</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                RMP Jewels & Women Clothing is a premium fashion destination bringing together exquisite jewellery and carefully curated women's clothing under one roof. We believe that what you wear is an expression of who you are — and we're here to make that expression beautiful.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From handcrafted necklaces and bridal sets to elegant sarees, lehengas, and everyday kurtas, every piece in our collection is chosen with care, quality, and the modern Indian woman in mind.
              </p>
            </motion.div>

            {/* What We Offer */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Gem, title: 'Fine Jewellery', desc: 'Necklaces, earrings, rings, bangles, maang tikka, and complete bridal sets — crafted to be cherished.' },
                  { icon: Shirt, title: "Women's Clothing", desc: 'Sarees, lehengas, kurtas, dresses, and more — from everyday elegance to occasion wear.' },
                  { icon: Heart, title: 'Curated Accessories', desc: 'Handbags, scarves, watches, and hair accessories to complete every look.' },
                ].map(item => (
                  <div key={item.title} className="p-5 rounded-sm border border-border bg-card/50">
                    <item.icon className="h-7 w-7 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Our Promise */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Our Promise</h2>
              <ul className="space-y-4">
                {[
                  'Authentic, premium-quality products — no compromises',
                  'Competitive pricing with regular exclusive offers',
                  'Fast and reliable delivery across India',
                  'Dedicated customer support — we\'re always here to help',
                  'Easy returns and a hassle-free shopping experience',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Closing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center py-8 border-t border-border"
            >
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                At RMP, we don't just sell clothing and jewellery — we help you tell your story. Shop at <span className="text-primary font-medium">ekart24.com</span> and discover a collection made for you.
              </p>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
