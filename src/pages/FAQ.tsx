import { useState, useEffect } from 'react';
import { ChevronDown, Search, Package, CreditCard, Truck, RefreshCw, Lightbulb, Wrench, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: any;
  color: string;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Products & Ordering",
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
    faqs: [
      {
        question: "What types of products does Azzaro Home offer?",
        answer: "Azzaro Home specializes in premium lighting fixtures (chandeliers, pendants, wall sconces, table lamps), luxury ceiling fans, high-end bath fittings, and curated home decor accessories. All our products are carefully selected to bring elegance and sophistication to your living spaces."
      },
      {
        question: "Do I need to create an account to place an order?",
        answer: "While you can browse our products as a guest, creating an account allows you to save items to your wishlist, track orders, manage multiple shipping addresses, and enjoy a faster checkout experience. Guest checkout is available for one-time purchases."
      },
      {
        question: "Can I see products in person before purchasing?",
        answer: "We currently operate as an online-first retailer to offer you the best prices. However, we provide detailed product specifications, high-resolution images, and 360° views where available. Our customer service team is also available to answer any questions about dimensions, finishes, and installation requirements."
      },
      {
        question: "How do I know which size chandelier or light fixture is right for my space?",
        answer: "As a general rule, add the room's length and width in feet, then convert to inches for the ideal fixture diameter. For example, a 12' x 14' room would suit a 26\" diameter fixture. For dining tables, choose a fixture that's 12\" narrower than the table width. Our product pages include detailed dimensions, and our team can provide personalized recommendations."
      },
      {
        question: "Are your lighting fixtures compatible with dimmer switches?",
        answer: "Most of our fixtures are dimmable when paired with compatible LED bulbs and appropriate dimmer switches. Check the product specifications for dimming compatibility. We recommend using LED-compatible dimmers for optimal performance and longevity."
      },
      {
        question: "Do your products come with bulbs included?",
        answer: "Unless specified in the product description, bulbs are typically not included to allow you to choose your preferred color temperature and wattage. We provide bulb type specifications (E26, E12, GU10, etc.) and maximum wattage recommendations for each fixture."
      }
    ]
  },
  {
    title: "Installation & Technical",
    icon: Wrench,
    color: "text-amber-600 dark:text-amber-400",
    faqs: [
      {
        question: "Do I need a professional electrician to install my lighting fixture?",
        answer: "We strongly recommend hiring a licensed electrician for all electrical installations to ensure safety and compliance with local building codes. Improper installation can void warranties and create safety hazards. Ceiling fans and hardwired fixtures especially require professional installation."
      },
      {
        question: "Are installation instructions included with my purchase?",
        answer: "Yes, all our products come with detailed installation manuals and hardware. Many fixtures also include QR codes linking to video installation guides. However, professional installation is always recommended for electrical fixtures."
      },
      {
        question: "What ceiling height is required for chandeliers?",
        answer: "For standard 8-9 foot ceilings, the bottom of the chandelier should hang 30-36 inches above a dining table or 7 feet above the floor in entryways. For higher ceilings, add 3 inches of chain/rod length for every additional foot of ceiling height. Adjustable downrods are available for most fixtures."
      },
      {
        question: "Can ceiling fans be installed on sloped or vaulted ceilings?",
        answer: "Many of our ceiling fans include sloped ceiling adapters for angles up to 30 degrees. Check the product specifications for compatibility. For steeper slopes or cathedral ceilings, special mounting hardware may be required."
      },
      {
        question: "What is the difference between hardwired and plug-in fixtures?",
        answer: "Hardwired fixtures connect directly to your home's electrical system and require professional installation. Plug-in fixtures have a cord and plug, making them easier to install but requiring an accessible outlet. Most of our statement pieces are hardwired for a clean, professional look."
      }
    ]
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    color: "text-green-600 dark:text-green-400",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-10 business days. Large items like chandeliers and ceiling fans shipped via freight typically arrive in 7-14 business days. Custom or made-to-order pieces may require 4-8 weeks. You'll receive tracking information once your order ships."
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free shipping on all orders of $1,000 or more within the continental United States. For orders under $1,000, shipping costs are calculated at checkout based on item size, weight, and destination."
      },
      {
        question: "How are large chandeliers and fixtures packaged?",
        answer: "We take extreme care in packaging. Large fixtures are double-boxed with custom foam inserts, protective wrapping, and reinforced corners. Freight shipments are crated and palletized. We recommend inspecting packages before signing the delivery receipt."
      },
      {
        question: "What if my item arrives damaged?",
        answer: "Please inspect all packages upon delivery and note any visible damage on the delivery receipt. Contact us within 48 hours with photos of the packaging and damage. We'll arrange for a replacement or repair promptly. Keep all original packaging materials for claims processing."
      },
      {
        question: "Can I track my order?",
        answer: "Absolutely! Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order status by logging into your account or contacting our customer service team."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we ship within the United States only. For international inquiries, please contact our customer service team at hello@azzarohome.com to discuss options."
      }
    ]
  },
  {
    title: "Returns & Exchanges",
    icon: RefreshCw,
    color: "text-purple-600 dark:text-purple-400",
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 14 days of delivery for unused, uninstalled items in original packaging. A Return Authorization (RA) number is required before returning any item. A 15% restocking fee may apply. Custom orders, installed fixtures, and clearance items are final sale."
      },
      {
        question: "How do I initiate a return?",
        answer: "Contact our customer service team at hello@azzarohome.com or call +1607-661-1111 to request a Return Authorization number. Include your order number and reason for return. Once approved, you'll receive return shipping instructions. Unauthorized returns will not be accepted."
      },
      {
        question: "Who pays for return shipping?",
        answer: "Return shipping costs are the customer's responsibility unless the item was damaged, defective, or we shipped the wrong product. We recommend using a trackable shipping method and purchasing insurance for high-value items."
      },
      {
        question: "Can I exchange an item for a different finish or size?",
        answer: "Yes, exchanges are possible for items in stock. Contact us to arrange an exchange. You may need to return the original item and place a new order. Price differences and shipping costs may apply."
      },
      {
        question: "What items cannot be returned?",
        answer: "The following are non-returnable: custom or made-to-order products, installed or used fixtures, clearance/final sale items, special order finishes, and items damaged due to improper installation or use."
      },
      {
        question: "How long does it take to receive my refund?",
        answer: "Once we receive and inspect your return, refunds are processed within 5-7 business days to your original payment method. Please allow additional time for your bank to post the credit to your account."
      }
    ]
  },
  {
    title: "Payment & Pricing",
    icon: CreditCard,
    color: "text-rose-600 dark:text-rose-400",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All transactions are processed securely through encrypted payment gateways."
      },
      {
        question: "Is it safe to enter my credit card information on your website?",
        answer: "Absolutely. Our website uses industry-standard SSL encryption to protect your personal and payment information. We never store complete credit card numbers on our servers. Look for the padlock icon in your browser's address bar."
      },
      {
        question: "Do you offer financing options?",
        answer: "We're currently exploring financing partnerships to offer flexible payment options. Please check back soon or contact us for updates on financing availability."
      },
      {
        question: "Why do prices vary from what I saw earlier?",
        answer: "Prices may change due to promotions, seasonal sales, or manufacturer pricing updates. We recommend adding items to your cart or wishlist to monitor price changes. Sale prices are valid while supplies last."
      },
      {
        question: "Do you price match?",
        answer: "We strive to offer competitive pricing on all our premium products. While we don't have a formal price match policy, we occasionally run promotions and sales. Sign up for our newsletter to receive exclusive offers and early access to sales."
      },
      {
        question: "Are taxes included in the listed prices?",
        answer: "Prices shown do not include sales tax. Applicable taxes are calculated at checkout based on your shipping address and local tax regulations."
      }
    ]
  },
  {
    title: "Product Care & Maintenance",
    icon: Lightbulb,
    color: "text-yellow-600 dark:text-yellow-400",
    faqs: [
      {
        question: "How do I clean my chandelier or light fixture?",
        answer: "Turn off power at the circuit breaker before cleaning. Use a soft, dry microfiber cloth for regular dusting. For crystal chandeliers, use a solution of 1 part isopropyl alcohol to 3 parts distilled water. Spray on a cloth, not directly on the fixture. Avoid harsh chemicals and abrasive materials."
      },
      {
        question: "How often should I clean my ceiling fan?",
        answer: "Dust ceiling fan blades monthly to maintain efficiency and prevent dust buildup. Use a damp cloth or specialized fan duster. Clean the motor housing quarterly. Regular cleaning prevents wobbling and extends the fan's lifespan."
      },
      {
        question: "What causes my chandelier crystals to become cloudy?",
        answer: "Cloudiness is typically caused by dust, humidity, or residue from cleaning products. Clean with a proper crystal cleaning solution or the alcohol-water mixture mentioned above. Ensure the fixture is completely dry after cleaning."
      },
      {
        question: "How do I maintain brass or bronze finishes?",
        answer: "Most of our brass and bronze fixtures have a protective lacquer coating. Clean with a soft, damp cloth only. Avoid polishes and abrasive cleaners that can damage the finish. For unlacquered brass that develops patina, use a brass polish if you prefer the original shine."
      },
      {
        question: "My ceiling fan is wobbling. What should I do?",
        answer: "Wobbling can be caused by unbalanced blades, loose screws, or improper installation. First, tighten all screws on the blade brackets and motor housing. If wobbling persists, use the balancing kit included with your fan or contact us for assistance."
      },
      {
        question: "Do your products come with warranties?",
        answer: "Yes, all our products include manufacturer warranties ranging from 1-5 years depending on the item. Warranties cover defects in materials and workmanship but do not cover damage from improper installation, misuse, or normal wear. Keep your receipt and product documentation for warranty claims."
      }
    ]
  },
  {
    title: "Account & Support",
    icon: HelpCircle,
    color: "text-indigo-600 dark:text-indigo-400",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign In' in the top navigation and select 'Create Account.' You can also sign up using your Google account for faster registration. Creating an account allows you to save your wishlist, track orders, and manage addresses."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Sign In' and then 'Forgot Password.' Enter your email address, and we'll send you a password reset link. If you don't receive the email within a few minutes, check your spam folder."
      },
      {
        question: "How do I update my account information?",
        answer: "Log into your account and navigate to 'Account Settings.' You can update your name, email, password, and saved addresses. Changes are saved automatically."
      },
      {
        question: "Can I save items for later?",
        answer: "Yes! Click the heart icon on any product to add it to your wishlist. You must be logged in to save items. Your wishlist is accessible from any device when you're signed in."
      },
      {
        question: "How can I contact customer service?",
        answer: "We're here to help! Email us at hello@azzarohome.com, call +1607-661-1111, or use the contact form on our website. Our team typically responds within 24 hours during business days."
      },
      {
        question: "Do you have a showroom I can visit?",
        answer: "We currently operate online to offer you the best selection and pricing. However, we're exploring showroom locations. Follow us on social media or subscribe to our newsletter for updates on future showroom openings."
      },
      {
        question: "How do I unsubscribe from marketing emails?",
        answer: "Click the 'Unsubscribe' link at the bottom of any marketing email. You can also manage your email preferences in your account settings. Note that you'll still receive transactional emails about your orders."
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <>
      <Header />
      <CartDrawer />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about our products, ordering, shipping, and more.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.title}
                  onClick={() => {
                    const element = document.getElementById(category.title.toLowerCase().replace(/\s+/g, '-'));
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors whitespace-nowrap"
                >
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-sm font-medium">{category.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse our categories below.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <section
                  key={category.title}
                  id={category.title.toLowerCase().replace(/\s+/g, '-')}
                  className="scroll-mt-24"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg bg-card border`}>
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <h2 className="text-2xl font-display font-semibold">
                      {category.title}
                    </h2>
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border rounded-lg px-6 bg-card"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-5">
                          <span className="font-medium pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-3">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our customer support team is ready to assist you with any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a 
              href="mailto:hello@azzarohome.com" 
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-card transition-colors font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
