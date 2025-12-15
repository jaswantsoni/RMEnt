import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Leaf, Heart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '10+', label: 'Years of Excellence' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Products' },
  { value: '100+', label: 'Design Awards' },
];

const values = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Every product is meticulously crafted using premium materials and traditional techniques.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Committed to eco-friendly practices and sustainable sourcing across our supply chain.',
  },
  {
    icon: Heart,
    title: 'Passion for Design',
    description: 'Our team of designers blend artistry with functionality to create timeless pieces.',
  },
];

const team = [
  {
    name: 'Rajesh Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    name: 'Priya Patel',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    name: 'Amit Kumar',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
            alt="Luxury Interior"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6">
              Crafting <span className="text-gradient-gold">Luxury</span> for Your Home
            </h1>
            <p className="text-xl text-muted-foreground">
              Since 2010, Azzaro Home has been at the forefront of luxury home decor, 
              bringing together exceptional craftsmanship and contemporary design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-semibold text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">
                A Legacy of <span className="text-gradient-gold">Excellence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  What began as a small lighting showroom in Mumbai has grown into one of 
                  India's most prestigious home decor destinations. Our journey started with 
                  a simple belief: every home deserves to be extraordinary.
                </p>
                <p>
                  Over the years, we've curated collections from the world's finest artisans 
                  and manufacturers, bringing together traditional craftsmanship and modern 
                  design sensibilities.
                </p>
                <p>
                  Today, Azzaro Home stands as a testament to our unwavering commitment to 
                  quality, design, and customer satisfaction. We continue to push boundaries, 
                  introducing innovative products that transform spaces into works of art.
                </p>
              </div>
              <Button
                size="lg"
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/collections">Explore Our Collection</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
                alt="Azzaro Showroom"
                className="rounded-sm"
              />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-sm -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Our <span className="text-gradient-gold">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-primary/10 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Meet Our <span className="text-gradient-gold">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate individuals behind Azzaro Home
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
