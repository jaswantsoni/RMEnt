import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Leaf, Heart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '5K+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Products' },
  { value: '100+', label: 'Jewellery Designs' },
  { value: '50+', label: 'Clothing Styles' },
];

const values = [
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Every piece is meticulously crafted using premium materials and traditional techniques.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
  },
  {
    icon: Leaf,
    title: 'Authentic Products',
    description: 'We source only genuine, high-quality jewellery and clothing — no compromises.',
  },
  {
    icon: Heart,
    title: 'Passion for Fashion',
    description: 'Our curators blend artistry with wearability to bring you timeless, elegant pieces.',
  },
];

const team = [
  {
    name: 'Founder',
    role: 'Vision & Strategy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    name: 'Creative Lead',
    role: 'Curation & Design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    name: 'Operations Head',
    role: 'Logistics & Support',
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
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920"
            alt="RMP Fashion"
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
              Crafting <span className="text-gradient-gold">Elegance</span> for Every Woman
            </h1>
            <p className="text-xl text-muted-foreground">
              RMP Jewels & Women Clothing — where fine jewellery meets curated fashion,
              crafted for the woman who values elegance in every detail.
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
                A Story of <span className="text-gradient-gold">Passion & Style</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  RMP Jewels & Women Clothing was born from a love of beautiful things — 
                  the glint of a well-crafted necklace, the drape of a silk saree, the 
                  confidence that comes from wearing something truly special.
                </p>
                <p>
                  We've curated collections from skilled artisans and trusted manufacturers, 
                  bringing together traditional craftsmanship and contemporary design sensibilities 
                  for the modern Indian woman.
                </p>
                <p>
                  Today, RMP stands as a destination for women who want premium jewellery and 
                  clothing without compromise — available at <strong>ekart24.com</strong>.
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
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
                alt="RMP Jewellery Collection"
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
              The passionate individuals behind RMP Jewels & Women Clothing
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
